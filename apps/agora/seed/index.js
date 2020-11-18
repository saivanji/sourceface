const path = require("path")
const { execSync } = require("child_process")

const { DATABASE_URL } = process.env

const generatePath = (name) => path.resolve(__dirname, name)

const run = (command, message) => {
  execSync(command, {
    stdio:
      /**
       * Disabling "stdout" forwarding.
       */
      ["pipe", "ignore", "pipe"],
  })
  console.log(message)
}

require("yargs")
  .command(
    "save [name]",
    "save seed",
    (yargs) => {
      yargs.positional("name", {
        describe: "saves seed from current database",
        default: "default",
      })
    },
    (argv) =>
      run(
        `pg_dump ${DATABASE_URL} > ${generatePath(argv.name)}.sql`,
        `"${argv.name}" seed was saved successfully`
      )
  )
  .command(
    "restore [name]",
    "restore seed",
    (yargs) => {
      yargs.positional("name", {
        describe: "applies seed data",
        default: "default",
      })
    },
    (argv) => {
      run(
        `
        echo "DROP SCHEMA public CASCADE; CREATE SCHEMA public;" | psql ${DATABASE_URL} &&
        psql ${DATABASE_URL} < ${generatePath(argv.name)}.sql
        `,
        `"${argv.name}" seed was applied successfully`
      )
    }
  ).argv
