export default (db, pgp, { layouts }) =>
  db.tx(async t => {
    await t.none("INSERT INTO pages (title, layout_id) VALUES ('Orders', $1)", [
      layouts.orders.id,
    ])

    await t.none("INSERT INTO pages (title, layout_id) VALUES ('Order', $1)", [
      layouts.order.id,
    ])
  })
