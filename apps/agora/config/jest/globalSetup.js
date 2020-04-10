import { exec } from "child_process"

export default () =>
  new Promise((resolve, reject) => {
    /**
     * Cleaning database in case it was not properly destroyed
     */
    exec("yarn migrate:down", (err, stdout, stderr) => {
      if (err || stderr) return reject(err || stderr)

      /**
       * Applying database migrations
       */
      exec("yarn migrate:up", (err, stdout, stderr) => {
        if (err || stderr) return reject(err || stderr)
        resolve()
      })
    })
  })
