import createSources from "./sources"
import createLayouts from "./layouts"
import createPages from "./pages"
import createModules from "./modules"

const pgp = require("pg-promise")()

const db = pgp(process.env.DATABASE_URL)

;(async () => {
  try {
    await createSources(db, pgp)
    const layouts = await createLayouts(db, pgp)
    await createPages(db, pgp, { layouts })
    await createModules(db, pgp, { layouts })
    console.log("Seeds were applied successfully")
    process.exit(0)
  } catch (err) {
    console.error(err)
    process.exit(1)
  }
})()
