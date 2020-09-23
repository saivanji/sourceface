import { times } from "ramda"

export default db =>
  db.tx(async t => {
    const [orders, orderCreation, orderEdition] = await t.many(
      `
      INSERT INTO layouts (id) VALUES
      ${times(() => "(nextval('layouts_id_seq'))", 2).join(",")}
      RETURNING *`
    )

    return {
      orders,
      orderCreation,
      orderEdition,
    }
  })
