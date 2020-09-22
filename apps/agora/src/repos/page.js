export const oneByPath = async (path, pg) =>
  await pg.one(sql.oneByPath, [pathToPattern(path)])

const sql = {
  oneByPath: `
    SELECT * FROM pages WHERE route ~ $1
  `,
}

const pathToPattern = path => {
  const pattern = path
    .slice(1)
    .split("/")
    /**
     * Excluding slashes for the current item using negative look arounds.
     */
    .map(x => `(${x}|((?!\\/).)+)`)
    .join("\\/")

  return `^\\/${pattern}$`
}
