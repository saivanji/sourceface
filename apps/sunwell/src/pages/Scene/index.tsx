import React from "react"
import { Button, Breadcrumbs, Table, Pagination } from "kit/index"
import styles from "./index.scss"
import data from "./data.json"

export default () => {
  return (
    <div className={styles.root}>
      <Breadcrumbs
        path={[
          { title: "Administration", link: "#" },
          { title: "Users", link: "#" },
        ]}
      />
      <div className={styles.panel}>
        <span className={styles.title}>Orders</span>
        <Button className={styles.newOrder}>New order</Button>
      </div>
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
          {data.map((item, i) => (
            <Table.Tr key={i}>
              <Table.Td>{item.id}</Table.Td>
              <Table.Td>{item.date}</Table.Td>
              <Table.Td>{item.name}</Table.Td>
              <Table.Td>{item.address}</Table.Td>
              <Table.Td>{item.delivery_type}</Table.Td>
              <Table.Td>{item.status}</Table.Td>
              <Table.Td>{item.payment_type}</Table.Td>
              <Table.Td>{item.amount}</Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
        <Table.Tfoot>
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
        </Table.Tfoot>
      </Table>
    </div>
  )
}
