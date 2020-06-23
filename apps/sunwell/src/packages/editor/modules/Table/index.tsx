import React, { useState } from "react"
import { useQuery } from "urql"
import moment from "moment"
import { Table, Pagination } from "packages/kit"
import styles from "./index.scss"

export default () => {
  const [page, setPage] = useState(0)
  const itemsPerPage = 10

  const [result] = useQuery({
    query: `
      mutation ($args: JSONObject) {
        rows: executeQuery(queryId: "listOrders", args: $args)
        count: executeQuery(queryId: "countOrders")
      }
   `,
    variables: {
      args: { limit: itemsPerPage, offset: itemsPerPage * page },
    },
  })

  if (!result.data) {
    return "Loading..."
  }

  const { rows, count } = result.data

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
            <div className={styles.footer}>
              <div className={styles.paginationInfo}>
                Showing <span>{itemsPerPage * page + 1}</span> to{" "}
                <span>{itemsPerPage * (page + 1)}</span> of{" "}
                <span>{count.count}</span> results
              </div>
              <Pagination
                className={styles.pagination}
                pageCount={Math.ceil(count.count / itemsPerPage)}
                selectedPage={page}
                pageSurroundings={1}
                onPageClick={setPage}
              />
            </div>
          </Table.Td>
        </Table.Tr>
      </Table.Tfoot>
    </Table>
  )
}
