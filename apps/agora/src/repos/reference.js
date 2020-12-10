import { pgp } from "../postgres"
import { createFields, getIndex } from "../utils/reference"

export const listByActionIds = (actionIds, pg) =>
  pg.manyOrNone(sql.listByActionIds, [actionIds])
export const refer = (actionId, field, ids, type, pg) =>
  pg.none(sql.refer(actionId, field, ids, type))
export const unreferAll = (actionId, field, pg) =>
  pg.none(sql.unreferAll, [actionId, field])

const sql = {
  listByActionIds: `
    SELECT r.action_id, r.field,
      row_to_json(p.*) AS page,
      row_to_json(o.*) AS operation,
      row_to_json(m.*) AS module
    FROM "references" AS r
    LEFT JOIN pages AS p ON (p.id = r.page_id)
    LEFT JOIN operations AS o ON (o.id = r.operation_id)
    LEFT JOIN modules AS m ON (m.id = r.module_id)
    WHERE r.action_id IN ($1:csv)
    ORDER BY ${getIndex("r.field")} ASC
  `,
  refer: (actionId, field, ids, type) =>
    pgp.helpers.insert(
      createFields(ids, keys[type], actionId, field),
      ["action_id", "field", keys[type]],
      "references"
    ),
  unreferAll: `
    DELETE FROM "references"
    WHERE action_id = $1 AND field ~ ('^' || $2 || '/[0-9]+$')
  `,
}

const keys = {
  page: "page_id",
  operation: "operation_id",
  module: "module_id",
}
