import React from "react"
import * as stock from "./stock"
import { Pipe } from "./components"

const definition = {
  query_id: "listOrders",
  args: [
    // {
    //   type: "group",
    //   value: {
    //     type: "action",
    //     action_id: 7,
    //   },
    // },
    {
      type: "key",
      key: "limit",
      value: {
        type: "literal",
        data: 5,
      },
    },
    {
      type: "key",
      key: "offset",
      value: {
        type: "literal",
        data: 8,
      },
    },
    {
      type: "key",
      key: "offset",
      value: {
        type: "local",
        name: "offset",
      },
    },
  ],
}

export default ({ value, onChange }) => {
  return (
    <Pipe stock={stock} value={value}>
      <stock.dict.runQuery.View definition={definition} />
      <stock.dict.redirect.View />
    </Pipe>
  )
}
