export default (db, pgp, { layouts }) =>
  db.tx(async t => {
    await t.none(
      "INSERT INTO pages (route, title, layout_id) VALUES ('/orders', 'Orders', $1)",
      [layouts.orders.id]
    )

    await t.none(
      "INSERT INTO pages (route, title, layout_id) VALUES ('/orders/create', 'Order creation', $1)",
      [layouts.orderCreation.id]
    )

    await t.none(
      "INSERT INTO pages (route, title, layout_id) VALUES ('/orders/:id', 'Order edition', $1)",
      [layouts.orderEdition.id]
    )
  })
