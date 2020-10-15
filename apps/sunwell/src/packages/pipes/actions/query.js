import React from "react"
import { Text, Value } from "../components"

const data = {
  query_id: 4,
  args: [
    {
      type: "action",
      payload: {
        action_id: 7,
      },
    },
    {
      type: "key",
      payload: {
        name: "limit",
        value: {
          type: "plain",
          value: 5,
        },
      },
    },
    {
      type: "key",
      payload: {
        name: "offset",
        value: {
          type: "action",
          payload: {
            action_id: 4,
          },
        },
      },
    },
  ],
}

export function View({ data }) {
  return (
    <>
      <Text>Run</Text>
      <Value color="blue">listOrders</Value>
      <Text>with</Text>
      <Value color="gray">limit</Value>
      <Text>as</Text>
      <Value color="gray">5</Value>
      <Text>and</Text>
      <Value color="gray">offset</Value>
      <Text>as</Text>
      <Value color="gray">7</Value>
    </>
  )
}
