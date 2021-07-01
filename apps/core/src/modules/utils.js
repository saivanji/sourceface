/**
 * Creates an object where keys are atom fields and values are lists
 * of attributes those atoms depend.
 */
export function createAtomDependencies(definition) {
  let result;

  for (let attributeKey in definition) {
    result = result || {};

    processAttribute(attributeKey, definition, result);
  }

  return result;
}

/**
 * Iterates over dependent atoms of given attribute to add that attribute to
 * the atom dependencies list.
 *
 * Also recursively iterates over attributes dependencies
 * of the attribute to find the atom those attributes may depend on.
 */
function processAttribute(
  attributeKey,
  definition,
  result,
  parentKey = attributeKey
) {
  const { atoms = [], attributes = [] } = definition[attributeKey];

  for (let atomKey of atoms) {
    result[atomKey] = result[atomKey] || [];

    const deps = result[atomKey];

    if (!deps.includes(parentKey)) {
      deps.push(parentKey);
    }
  }

  for (let attrKey of attributes) {
    processAttribute(attrKey, definition, result, parentKey);
  }
}
