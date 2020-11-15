import { pick } from "ramda"
import { pgp } from "../postgres"

export const one = (actionId, pg) => pg.one(sql.one, [actionId])
export const create = (actionId, moduleId, type, config, pg) =>
  pg.one(sql.create, [actionId, moduleId, type, config])
export const update = (actionId, fields, pg) =>
  pg.one(sql.update(fields), [actionId])
export const remove = (actionId, pg) => pg.none(sql.remove, [actionId])
export const listByModuleIds = (moduleIds, pg) =>
  pg.manyOrNone(sql.listByModuleIds, [moduleIds])
export const assocPages = (actionId, pageIds, pg) =>
  pg.none(sql.assocPages(actionId, pageIds))
export const assocCommands = (actionId, commandIds, pg) =>
  pg.none(sql.assocCommands(actionId, commandIds))
export const dissocPages = (actionId, pg) =>
  pg.none(sql.dissocPages, [actionId])
export const dissocCommands = (actionId, pg) =>
  pg.none(sql.dissocCommands, [actionId])

const sql = {
  one: `
    SELECT * FROM actions WHERE id = $1
  `,
  create: `
    INSERT INTO actions (id, module_id, type, config) VALUES ($1, $2, $3, $4)
    RETURNING *
  `,
  remove: `
    DELETE FROM actions WHERE id = $1
  `,
  listByModuleIds: `
    SELECT * FROM actions WHERE module_id IN ($1:csv)
  `,
  dissocPages: `
    DELETE FROM actions_pages WHERE action_id = $1
  `,
  dissocCommands: `
    DELETE FROM actions_commands WHERE action_id = $1
  `,
  assocPages: (actionId, ids) =>
    pgp.helpers.insert(
      ids.map((page_id) => ({ action_id: actionId, page_id })),
      ["action_id", "page_id"],
      "actions_pages"
    ),
  assocCommands: (actionId, ids) =>
    pgp.helpers.insert(
      ids.map((command_id) => ({ action_id: actionId, command_id })),
      ["action_id", "command_id"],
      "actions_commands"
    ),
  update: (fields) =>
    pgp.helpers.update(pick(["name", "config"], fields), null, "actions", {
      emptyUpdate: sql.one,
    }) + " WHERE id = $1 RETURNING *",
}
