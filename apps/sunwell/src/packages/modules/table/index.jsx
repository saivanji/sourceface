import React, { useState } from "react"
import * as yup from "yup"
import moment from "moment"
import {
  Table,
  Pagination,
  Row,
  Label,
  Section,
  Input,
  Checkbox,
} from "@sourceface/components"
import { Compute, Form, Field } from "packages/toolkit"
import styles from "./index.scss"

export const Root = function TableModule({ config }) {
  const [page, setPage] = useState(0)
  const limit = 10
  const offset = limit * page
  // TODO: how to pass "limit" variable from `Value` in one evaluation loop?
  const constants = { page, limit, offset }
  const expressions = [config.items, config.count, config.limit]

  if (!config.items) {
    return <div>No items</div>
  }

  return (
    <Compute input={expressions} constants={constants}>
      {({ data: [rows, count, limit] }) => (
        <Table className={styles.root}>
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
          {config.pagination && limit !== 0 && (
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
          )}
        </Table>
      )}
    </Compute>
  )
}

export const Configuration = function TableModuleConfiguration({
  config,
  onConfigChange,
}) {
  return (
    <Form
      config={config}
      onConfigChange={onConfigChange}
      validationSchema={validationSchema}
    >
      <Section title="Basic">
        <Row>
          <Label title="Data">
            <Field name="items" type="text" component={Input} />
          </Label>
        </Row>
      </Section>
      <Section title="Pagination">
        <Row>
          <Field name="pagination" label="Enabled" component={Checkbox} />
        </Row>
        {config.pagination && (
          <>
            <Row>
              <Label title="Items per page">
                <Field name="limit" type="text" component={Input} />
              </Label>
            </Row>
            <Row>
              <Label title="Total count">
                <Field name="count" type="text" component={Input} />
              </Label>
            </Row>
            <Row>
              <Label title="Current page">
                <Field name="currentPage" type="text" component={Input} />
              </Label>
            </Row>
          </>
        )}
      </Section>
    </Form>
  )
}

export const defaultConfig = {
  items: "",
  pagination: true,
}

export const validationSchema = yup.object().shape({
  items: yup.string(),
  limit: yup.string().required(),
  pagination: yup.boolean().required(),
  // TODO: depending whether pagination is selected, other values are required
})

export const size = {
  w: 8,
  h: 6,
}
