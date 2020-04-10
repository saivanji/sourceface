import pgPromise from "pg-promise"
import moment from "moment"
import humps from "humps"

const { POSTGRES_URL } = process.env

const pgp = pgPromise({
  receive: (data) => {
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
  },
})

// transforming js Date to ISO string
pgp.pg.types.setTypeParser(1114, (s) => moment(s).toISOString())

export default () => pgp(POSTGRES_URL)
