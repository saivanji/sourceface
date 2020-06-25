import sources from "./sources"
import modules from "./modules"

const db = require("pg-promise")()(process.env.DATABASE_URL)

;(async () => {
  try {
    await sources(db)
    await modules(db)
    console.log("Seeds were applied successfully")
    process.exit(0)
  } catch (err) {
    console.error(err)
    process.exit(1)
  }
})()
