import React from "react"
import { withKnobs, select, boolean } from "@storybook/addon-knobs"
import { withA11y } from "@storybook/addon-a11y"
import Table from "./index"

export default { title: "Table", decorators: [withKnobs, withA11y] }

export const Regular = () => (
  <Table
    size={select("Size", ["compact", "normal", "loose"], "normal")}
    bordered={boolean("Bordered")}
    columns={["16rem", "auto"]}
  >
    <Table.Thead>
      <Table.Tr>
        <Table.Th>Email</Table.Th>
        <Table.Th>Groups</Table.Th>
      </Table.Tr>
    </Table.Thead>
    <Table.Tbody>
      {new Array(10).fill()(
        i => (
          <Table.Tr key={i}>
            <Table.Td>aiven715@gmail.com</Table.Td>
            <Table.Td>manager</Table.Td>
          </Table.Tr>
        ),
        5
      )}
    </Table.Tbody>
  </Table>
)
