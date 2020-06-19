// order creation will be in a modal

import React, { useEffect } from "react"
import { useMutation } from "urql"
import moment from "moment"
import { Button, Breadcrumbs, Table, Pagination } from "kit/index"
import styles from "./index.scss"
import data from "./data.json"

/* <Breadcrumbs */
/*   path={[ */
/*     { title: "Administration", link: "#" }, */
/*     { title: "Users", link: "#" }, */
/*   ]} */
/* /> */
export default () => {
  return (
    <div className={styles.root}>
      <div className={styles.panel}>
        <span className={styles.title}>Orders</span>
        <Button className={styles.newOrder}>New order</Button>
      </div>
      <TableModule />
    </div>
  )
}

const TableModule = () => {
  const [result, send] = useMutation(`
    mutation ($args: JSONObject) {
      executeQuery(queryId: 2, args: $args)
    }
 `)
  const limit = 10
  const offset = 20

  useEffect(() => {
    send({ args: { limit, offset } })
  }, [])

  if (!result.data) {
    return "Loading..."
  }

  const rows = result.data.executeQuery

  return (
    <Table>
      <Table.Thead>
        <Table.Tr>
          <Table.Th>Id</Table.Th>
          <Table.Th>Date</Table.Th>
          <Table.Th>Customer</Table.Th>
          <Table.Th>Address</Table.Th>
          <Table.Th>Delivery type</Table.Th>
          <Table.Th>Status</Table.Th>
          <Table.Th>Payment type</Table.Th>
          <Table.Th>Amount</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        {rows.map(row => (
          <Table.Tr key={row.id}>
            <Table.Td>{row.id}</Table.Td>
            <Table.Td>
              {moment(row.created_at).format("DD MMM YY, HH:mm")}
            </Table.Td>
            <Table.Td>{row.customer_name}</Table.Td>
            <Table.Td>{row.address}</Table.Td>
            <Table.Td>{row.delivery_type}</Table.Td>
            <Table.Td>{row.status}</Table.Td>
            <Table.Td>{row.payment_type}</Table.Td>
            <Table.Td>
              {row.amount} {row.currency}
            </Table.Td>
          </Table.Tr>
        ))}
      </Table.Tbody>
      <Table.Tfoot>
        <Table.Tr>
          <Table.Td colSpan={8}>
            <div className={styles.tableFooter}>
              <div className={styles.paginationInfo}>
                Showing <span>1</span> to <span>10</span> of <span>97</span>{" "}
                results
              </div>
              <Pagination
                className={styles.pagination}
                pageCount={20}
                selectedPage={4}
                pageSurroundings={1}
                onPageClick={console.log}
              />
            </div>
          </Table.Td>
        </Table.Tr>
      </Table.Tfoot>
    </Table>
  )
}
