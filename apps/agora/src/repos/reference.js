export const listPagesByActionIds = (actionIds, pg) =>
  pg.many(sql.listPagesByActionIds, [actionIds])
export const referActionPage = (actionId, pageId, field, pg) =>
  pg.none(sql.referActionPage, [actionId, pageId, field])
export const unreferActionPage = (actionId, field, pg) =>
  pg.none(sql.unreferActionPage, [actionId, field])

export const listOperationsByActionIds = (actionIds, pg) =>
  pg.many(sql.listOperationsByActionIds, [actionIds])
export const referActionOperation = (actionId, operationId, field, pg) =>
  pg.none(sql.referActionOperation, [actionId, operationId, field])
export const unreferActionOperation = (actionId, field, pg) =>
  pg.none(sql.unreferActionOperation, [actionId, field])

export const listModulesByActionIds = (actionIds, pg) =>
  pg.many(sql.listModulesByActionIds, [actionIds])
export const referActionModule = (actionId, moduleId, field, pg) =>
  pg.none(sql.referActionModule, [actionId, moduleId, field])
export const unreferActionModule = (actionId, field, pg) =>
  pg.none(sql.unreferActionModule, [actionId, field])

const sql = {
  listPagesByActionIds: `
    SELECT ap.action_id, ap.field, row_to_json(p.*) AS page
    FROM actions_pages AS ap
    LEFT JOIN pages AS p ON (p.id = ap.page_id)
    WHERE ap.action_id IN ($1:csv)
  `,
  referActionPage: `
    INSERT INTO actions_pages (action_id, page_id, field)
    VALUES ($1, $2, $3)
  `,
  unreferActionPage: `
    DELETE FROM actions_pages WHERE action_id = $1 AND field = $2
  `,
  listOperationsByActionIds: `
    SELECT ao.action_id, ao.field, row_to_json(c.*) AS operation
    FROM actions_operations AS ao
    LEFT JOIN commands AS c ON (c.id = ao.operation_id)
    WHERE ao.action_id IN ($1:csv)
  `,
  referActionOperation: `
    INSERT INTO actions_operations (action_id, operation_id, field)
    VALUES ($1, $2, $3)
  `,
  unreferActionOperation: `
    DELETE FROM actions_operations WHERE action_id = $1 AND field = $2
  `,
  listModulesByActionIds: `
    SELECT am.action_id, am.field, row_to_json(m.*) AS module
    FROM actions_modules AS am
    LEFT JOIN modules AS m ON (m.id = am.module_id)
    WHERE am.action_id IN ($1:csv)
  `,
  referActionModule: `
    INSERT INTO actions_modules (action_id, module_id, field)
    VALUES ($1, $2, $3)
  `,
  unreferActionModule: `
    DELETE FROM actions_modules WHERE action_id = $1 AND field = $2
  `,
}
