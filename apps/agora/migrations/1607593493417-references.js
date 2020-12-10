export const up = () =>
  global.pg.tx(async (t) => {
    // TODO: check that only either one of `page_id`, `operation_id` and `module_id` are presented
    await t.none(`
      CREATE TABLE "references"(
        action_id uuid NOT NULL REFERENCES actions(id) ON DELETE CASCADE,
        page_id int REFERENCES pages(id) ON DELETE RESTRICT,
        operation_id int REFERENCES operations(id) ON DELETE RESTRICT,
        module_id uuid REFERENCES modules(id) ON DELETE CASCADE,
        field text NOT NULL CHECK (field ~ '^[a-zA-Z]+/[0-9]+$'),
        UNIQUE (action_id, field, page_id),
        UNIQUE (action_id, field, operation_id),
        UNIQUE (action_id, field, module_id)
      )
    `)
  })

export const down = () =>
  global.pg.tx(async (t) => {
    await t.none(`
      DROP TABLE "references"
    `)
  })
