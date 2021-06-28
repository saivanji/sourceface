const { basename: getBasename } = require("path");

const prefix = "__babel_self";

module.exports = function ({ template, types }) {
  return {
    visitor: {
      CallExpression(path) {
        const calleeName = path.node.callee.name;

        /**
         * Skipping object call expressions
         */
        if (!calleeName) {
          return;
        }

        const binding = path.scope.getBinding(calleeName);

        /**
         * Skipping calls of functions not defined in the same file
         */
        if (!binding) {
          return;
        }

        const parentPath = binding.path.parentPath;

        if (
          /**
           * Ignoring non export declarations
           */
          !parentPath.isExportDeclaration() ||
          /**
           * Ignoring default export declarations
           */
          parentPath.isExportDefaultDeclaration() ||
          /**
           * Ignoring "export {}" constructions, TODO: implement
           */
          parentPath.node.specifiers?.length > 0
        ) {
          return;
        }

        path.node.callee = types.memberExpression(
          types.identifier(prefix),
          types.identifier(calleeName)
        );

        this.replaced = true;
      },
      Program: {
        exit(path, { filename }) {
          if (this.replaced) {
            const basename = getBasename(filename);
            const selfImport = template.ast(`
              import * as ${prefix} from "./${basename}";
            `);

            path.unshiftContainer("body", selfImport);
          }
        },
      },
    },
  };
};
