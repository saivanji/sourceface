import React, { useState, useMemo } from "react"
import moment from "moment"
import { Table, Pagination } from "packages/kit"
import styles from "./index.scss"

function TableModule({ config, fetching }) {
  const [page, setPage] = useState(0)
  const limit = 10
  const offset = limit * page
  const constants = useMemo(() => ({ page, limit, offset }), [
    page,
    limit,
    offset,
  ])
  const expressions = useMemo(() => [config.items, config.count], [config])

  return (
    <fetching.Value expressions={expressions} constants={constants}>
      {({ data: [rows, count] }) => (
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
                    Showing <span>{offset + 1}</span> to{" "}
                    <span>{limit * (page + 1)}</span> of <span>{count}</span>{" "}
                    results
                  </div>
                  <Pagination
                    className={styles.pagination}
                    pageCount={Math.ceil(count / limit)}
                    selectedPage={page}
                    pageSurroundings={1}
                    onPageClick={setPage}
                  />
                </div>
              </Table.Td>
            </Table.Tr>
          </Table.Tfoot>
        </Table>
      )}
    </fetching.Value>
  )
}

TableModule.moduleName = "table"

TableModule.Configuration = function TableModuleConfiguration() {
  return "Table configuration"
}

export default TableModule
