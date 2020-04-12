import http from "http"

export default async (query, variables) => {
  return new Promise((resolve, reject) => {
    const req = http.request(
      {
        hostname: "localhost",
        path: "/graphql",
        port: global.PORT,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      },
      (res) => {
        let rawBody = ""

        res.on("data", (data) => {
          rawBody = rawBody + data.toString()
        })

        res.on("end", () => {
          const body = JSON.parse(rawBody)

          if (body.errors) {
            reject(body.errors)
            return
          }

          resolve({
            data: body.data,
            headers: res.headers,
          })
        })
      }
    )

    req.on("error", (err) => reject(err))

    req.write(
      JSON.stringify({
        query,
        variables,
      })
    )
    req.end()
  })
}
