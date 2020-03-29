import "core-js/stable"
import "regenerator-runtime/runtime"
import express from "express"
import path from "path"

const NODE_ENV = process.env.NODE_ENV
const PORT = process.env.PORT

const app = express()

if (NODE_ENV === "production") {
  app.use(express.static(path.resolve(__dirname, "public")))
} else {
  // graphql playground on .get("/graphql")
}

app.listen(PORT, () => console.log(`Server is listening at ${PORT}...`))
