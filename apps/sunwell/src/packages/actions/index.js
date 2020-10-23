import React from "react"
import * as stock from "./stock"
import { Creation, Link, Pipe } from "./components"
import Autocomplete from "./components/Autocomplete"
import Toggle from "./components/Toggle"

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
  return !value || !value.length ? (
    <Toggle trigger={<Creation />}>
      {(close) => (
        <Autocomplete>
          <Autocomplete.Item onClick={close}>Test 1</Autocomplete.Item>
          <Autocomplete.Item>Test 2</Autocomplete.Item>
          <Autocomplete.Item>Test 3</Autocomplete.Item>
          <Autocomplete.Item>Test 4</Autocomplete.Item>
          <Autocomplete.Item>Test 5</Autocomplete.Item>
        </Autocomplete>
      )}
    </Toggle>
  ) : (
    <Link>
      <Pipe>
        <stock.runQuery.View definition={definition} />
        <stock.redirect.View />
      </Pipe>
    </Link>
  )
}
