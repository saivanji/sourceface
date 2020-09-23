export const oneByPath = async (path, pg) =>
  await pg.one(sql.oneByPath, [pathToPattern(path)])

const sql = {
  // TODO: investigate how to sort by a text column with help of regexp.
  // TODO: Sort pages by left to right path matching when multiple records
  // are returned. (exact path inclusions are having higher precedence over params).
  // TODO: cover by tests.
  oneByPath: `
    SELECT * FROM pages WHERE route ~ $1
    ORDER BY substring(route, $1)
    LIMIT 1
  `,
  hierarchy: `
  `,
}

/**
 * Transforming path to a pattern used for matching corresponding route.
 */
const pathToPattern = path => {
  const pattern = path
    .split("/")
    /**
     * Excluding slashes for the current item using negative look arounds.
     */
    .map(x => `(${x}|:[a-z]+)`)
    .join("\\/")

  return `^\\/${pattern}$`
}
