export const listByActionIds = async (actionIds, tableName, pg) =>
  transformList(
    await pg.manyOrNone(sql.listByActionIds, [
      actionIds,
      tableName,
      `actions_${tableName}`,
    ])
  )
export const referAction = (actionId, referenceId, field, tableName, pg) =>
  pg.none(sql.referAction, [actionId, referenceId, field, tableName])
export const unreferAction = (actionId, field, tableName, pg) =>
  pg.none(sql.unreferAction, [actionId, field, tableName])
export const unreferAllActions = (actionId, field, tableName, pg) =>
  pg.none(sql.unreferAllActions, [actionId, `${field}/`, tableName])

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
  referAction: `
    INSERT INTO $4:name (action_id, reference_id, field)
    VALUES ($1, $2, $3, $4)
  `,
  unreferAction: `
    DELETE FROM $3:name WHERE action_id = $1 AND field = $2
  `,
  unreferAllActions: `
    DELETE FROM $3:name WHERE action_id = $1 AND field ~ $2
  `,
}

// TODO: join one and many in one object in case we have both presented
export const transformList = (items) =>
  items.map((x) => ({
    actionId: x.actionId,
    field: x.key,
    one: x.isMany ? null : x.data[0],
    many: !x.isMany ? null : x.data,
  }))
