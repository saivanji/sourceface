export const listByActionIds = async (actionIds, type, pg) =>
  transformList(
    await pg.manyOrNone(sql.listByActionIds, [actionIds, type, tableName(type)])
  )
export const refer = (actionId, referenceId, field, type, pg) =>
  pg.none(sql.refer, [actionId, referenceId, field, tableName(type)])
export const unreferAll = (actionId, field, type, pg) =>
  pg.none(sql.unreferAll, [actionId, field, tableName(type)])

const sql = {
  listByActionIds: `
    SELECT
      t.action_id,
      regexp_replace(field, '(.*)/(.*)', '\\1') as key,
      json_agg(s.*) AS data, 
      t.field LIKE '%/%' AS is_many
    FROM $3:name AS t
    LEFT JOIN $2:name AS s ON (s.id = t.reference_id)
    WHERE t.action_id IN ($1:csv)
    GROUP BY t.action_id, is_many, key
  `,
  refer: `
    INSERT INTO $4:name (action_id, reference_id, field)
    VALUES ($1, $2, $3)
  `,
  unreferAll: `
    DELETE FROM $3:name
    WHERE action_id = $1 AND field ~ ('^' || $2 || '(/[0-9]+)?$')
  `,
}

const transformList = (items) =>
  items.map((x) => ({
    actionId: x.actionId,
    field: x.key,
    one: x.isMany ? null : x.data[0],
    many: !x.isMany ? null : x.data,
  }))

const tableName = (name) => `actions_${name}_refs`
