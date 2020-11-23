import pgPromise from "pg-promise"
import moment from "moment"
import humps from "humps"

const { DATABASE_URL } = process.env

export const pgp = pgPromise({
  query: ({ query }) => {
    console.log(moment().format("HH:mm:s"), query.trim())
  },
  receive: onReceive,
})

export const mergeableColumn = (name) => ({
  name,
  mod: "^",
  init: ({ value }) =>
    `jsonb_recursive_merge(${name}::jsonb, '${JSON.stringify(value)}'::jsonb)`,
})

// transforming js Date to ISO string
pgp.pg.types.setTypeParser(1114, (s) => moment(s).toISOString())

function onReceive(data) {
  /**
   * Camelizing column names
   */
  const template = data[0]

  for (let prop in template) {
    const camel = humps.camelize(prop)
    if (!(camel in template)) {
      for (let i = 0; i < data.length; i++) {
        let d = data[i]
        d[camel] = d[prop]
        delete d[prop]
      }
    }
  }
}

export default () => pgp(DATABASE_URL)
