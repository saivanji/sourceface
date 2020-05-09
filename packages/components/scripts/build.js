#!/usr/bin/env node
const path = require("path")
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

function build(env) {
  return new Promise((resolve, reject) => {
    exec(
      "node ./node_modules/.bin/webpack --colors",
      {
        env: {
          NODE_ENV: env,
        },
      },
      (err, stdout, stderr) => {
        if (err || stderr) return reject(err || stderr)

        resolve(stdout)
      }
    )
  })
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
