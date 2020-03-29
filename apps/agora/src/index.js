import "core-js/stable"
import "regenerator-runtime/runtime"
import express from "express"
import graphqlHTTP from "express-graphql"
import path from "path"
import playground from "graphql-playground-middleware-express"
import schema from "./graphql"

const NODE_ENV = process.env.NODE_ENV
const PORT = process.env.PORT
const GRAPHQL_ENDPOINT = "/graphql"

const app = express()

app.post(
  GRAPHQL_ENDPOINT,
  graphqlHTTP({
    schema,
  })
)

if (NODE_ENV === "production") {
  app.use(express.static(path.resolve(__dirname, "public")))
} else {
  app.get(GRAPHQL_ENDPOINT, playground({ endpoint: GRAPHQL_ENDPOINT }))
}

app.listen(PORT, () => console.log(`Server is listening at ${PORT}...`))
