export default (db, pgp, { layouts }) =>
  db.tx(async t => {
    const layoutId = layouts[0].id
    await t.none(
      "INSERT INTO pages (title, layout_id) VALUES ('test page', $1)",
      [layoutId]
    )
  })
