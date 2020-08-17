const fs = require("fs");
const path = require("path");
const { print, introspectionFromSchema, buildASTSchema } = require("graphql");
const { loadFilesSync } = require("@graphql-tools/load-files");
const { mergeTypeDefs } = require("@graphql-tools/merge");

const DEST_DIR = "./lib";

const loadedFiles = loadFilesSync(`${__dirname}/src/*.graphql`);
const ast = mergeTypeDefs(loadedFiles);

if (!fs.existsSync(DEST_DIR)) {
  fs.mkdirSync(DEST_DIR);
}

const printedSDL = JSON.stringify(print(ast));
const introspection = JSON.stringify(
  introspectionFromSchema(buildASTSchema(ast))
);
const index = `
exports.printedSDL = require("./printedSDL.js")
exports.introspection = require("./introspection.js")
`.trim();

const save = (filename, content) =>
  fs.writeFileSync(path.join(__dirname, DEST_DIR, filename), content);

save("printedSDL.js", `module.exports = ${printedSDL}`);
save("introspection.js", `module.exports = ${introspection}`);
save("index.js", index);
