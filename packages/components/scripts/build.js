#!/usr/bin/env node
const path = require("path")
const util = require("util")
const fs = require("fs")
const { exec } = require("child_process")
const pkg = require("../package.json")
const clean = require("./clean")

async function main() {
  return [
    clean(),
    await build("production"),
    await build("development"),
    populateIndexes(),
  ]
}

async function build(env) {
  try {
    const { stdout, stderr } = await util.promisify(exec)(
      "node ./node_modules/.bin/webpack --colors",
      {
        env: {
          NODE_ENV: env,
        },
      }
    )

    if (stderr) throw stderr

    return stdout
  } catch (err) {
    throw err.stdout || err.stderr
  }
}

function populateIndexes() {
  const content = `"use strict"
if (process.env.NODE_ENV === "production") {
  module.exports = require("./prod")
} else {
  module.exports = require("./dev")
}`

  for (let item of pkg.files) {
    fs.writeFileSync(
      path.resolve(__dirname, "../", item, "index.js"),
      content,
      "utf-8"
    )
  }
}

if (require.main === module) {
  main()
    .then(outs => outs.forEach(out => out && console.log(out)))
    .catch(err => {
      console.log(err)
      process.exit(1)
    })
}

module.exports = main
