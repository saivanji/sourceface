const path = require("path")
const { exec } = require("child_process")

const { DATABASE_URL } = process.env

const generatePath = name => path.resolve(__dirname, name)

const run = (command, message) =>
  exec(command, (error, stdout, stderr) => {
    if (error || stderr) {
      console.log(error || stderr)

      process.exit(1)
      return
    }

    console.log(message)
  })

require("yargs")
  .command(
    "dump [name]",
    "dump seed",
    yargs => {
      yargs.positional("name", {
        describe: "generates seed from current database",
        default: "default",
      })
    },
    argv =>
      run(
        `pg_dump ${DATABASE_URL} > ${generatePath(argv.name)}.sql`,
        `"${argv.name}" seed was generated successfully`
      )
  )
  .command(
    "restore [name]",
    "restore seed",
    yargs => {
      yargs.positional("name", {
        describe: "applies seed data",
        default: "default",
      })
    },
    argv => {
      run(
        `psql ${DATABASE_URL} < ${generatePath(argv.name)}.sql`,
        `"${argv.name}" seed was applied successfully`
      )
    }
  ).argv
