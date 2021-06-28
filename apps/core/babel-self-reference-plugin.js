const { basename: getBasename } = require("path");
const { default: template } = require("@babel/template");
const types = require("@babel/types");

module.exports = function () {
  return {
    visitor: {
      CallExpression(path) {
        const calleeName = path.node.callee.name;

        // skipping object call expressions
        if (!calleeName) {
          return;
        }

        const binding = path.scope.getBinding(calleeName);

        // skipping calls of functions not defined in the same file
        if (!binding) {
          return;
        }

        const parentPath = binding.path.parentPath;

        if (
          // ignoring non export declarations
          !parentPath.isExportDeclaration() ||
          // ignoring default export declarations
          parentPath.isExportDefaultDeclaration() ||
          // ignoring "export {}" constructions, TODO: implement
          parentPath.node.specifiers?.length > 0
        ) {
          return;
        }

        path.node.callee = types.memberExpression(
          types.identifier("__self"),
          types.identifier(calleeName)
        );

        this.replaced = true;
      },
      Program: {
        exit(path, { filename }) {
          if (this.replaced) {
            const basename = getBasename(filename);
            const selfImport = template.ast(`
              import * as __self from "./${basename}";
            `);

            path.unshiftContainer("body", selfImport);
          }
        },
      },
    },
  };
};
