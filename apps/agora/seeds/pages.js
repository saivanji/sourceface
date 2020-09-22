export default (db, pgp, { layouts }) =>
  db.tx(async t => {
    await t.none(
      "INSERT INTO pages (route, title, layout_id) VALUES ('/orders', 'Orders', $1)",
      [layouts.orders.id]
    )

    await t.none(
      "INSERT INTO pages (route, title, layout_id) VALUES ('/orders/:orderId', 'Order', $1)",
      [layouts.order.id]
    )
  })
