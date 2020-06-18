import sources from "./sources"

const db = require("pg-promise")()(process.env.DATABASE_URL)

;(async () => {
  try {
    await sources(db)
    console.log("Seeds were applied successfully")
    process.exit(0)
  } catch (err) {
    console.error(err)
    process.exit(1)
  }
})()
