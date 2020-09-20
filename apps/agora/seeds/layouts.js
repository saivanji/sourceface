import { times } from "ramda"

export default db =>
  db.tx(async t => {
    const [orders, order] = await t.many(
      `
      INSERT INTO layouts (id) VALUES
      ${times(() => "(nextval('layouts_id_seq'))", 2).join(",")}
      RETURNING *`
    )

    return {
      orders,
      order,
    }
  })
