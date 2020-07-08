import React, { useState, useMemo } from "react"
import * as yup from "yup"
import moment from "moment"
import { Table, Pagination, Row, Label, Section } from "packages/kit"
import styles from "./index.scss"

function TableModule({ config, expression }) {
  const [page, setPage] = useState(0)
  const limit = 10
  const offset = limit * page
  const constants = useMemo(() => ({ page, limit, offset }), [
    page,
    limit,
    offset,
  ])
  const expressions = useMemo(
    () => [config.items, config.count, config.limit],
    [config]
  )

  if (!config.items) {
    return <div>No items</div>
  }

  return (
    <expression.Value input={expressions} constants={constants}>
      {({ data: [rows, count, limit] }) => (
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
    </expression.Value>
  )
}

TableModule.defaultValues = {
  items: "",
  pagination: true,
}

TableModule.validationSchema = yup.object().shape({
  items: yup.string(),
})

TableModule.Configuration = function TableModuleConfiguration({
  components: { Form, Input, Checkbox },
  config,
}) {
  return (
    <Form validationSchema={TableModule.validationSchema}>
      <Section title="Basic">
        <Row>
          <Label title="Data">
            <Input name="items" type="text" />
          </Label>
        </Row>
      </Section>
      <Section title="Pagination">
        <Row>
          <Checkbox name="pagination" label="Enabled" />
        </Row>
        {config.pagination && (
          <>
            <Row>
              <Label title="Items per page">
                <Input name="limit" type="text" />
              </Label>
            </Row>
            <Row>
              <Label title="Total count">
                <Input name="totalCount" type="text" />
              </Label>
            </Row>
            <Row>
              <Label title="Current page">
                <Input name="currentPage" type="text" />
              </Label>
            </Row>
          </>
        )}
      </Section>
    </Form>
  )
}

export default TableModule
