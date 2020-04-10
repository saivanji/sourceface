import { exec } from "child_process"

export default () =>
  new Promise((resolve, reject) => {
    /**
     * Dropping database migrations
     */
    exec("yarn migrate:down", (err, stdout, stderr) => {
      if (err || stderr) return reject(err || stderr)
      resolve()
    })
  })
