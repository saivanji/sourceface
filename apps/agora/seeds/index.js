import sources from "./sources"
import modules from "./modules"

const pgp = require("pg-promise")()

const db = pgp(process.env.DATABASE_URL)

;(async () => {
  try {
    await sources(db, pgp)
    await modules(db, pgp)
    console.log("Seeds were applied successfully")
    process.exit(0)
  } catch (err) {
    console.error(err)
    process.exit(1)
  }
})()
