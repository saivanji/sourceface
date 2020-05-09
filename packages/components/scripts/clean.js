#!/usr/bin/env node

const path = require("path")
const rimraf = require("rimraf")
const pkg = require("../package.json")

function main() {
  for (let item of pkg.files) {
    rimraf.sync(path.resolve(__dirname, "../", item))
  }
}

if (require.main === module) {
  main()
  console.log("Cleaned successfully.")
}

module.exports = main
