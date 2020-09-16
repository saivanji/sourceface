import React from "react"
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
import {
  Compute,
  Form,
  Field,
  Expression,
  useTransition,
} from "packages/toolkit"
import styles from "./index.scss"

// TODO: implement actions. on clicking button - execute query. or open another page

// TODO: consider implementing hooks api instead of Compute

// TODO: implement "input" module and make search over table feature

export const Root = function TableModule({ config, local: { limit, offset } }) {
  const changePage = useTransition("page")

  if (!config.items) {
    return <div>No items</div>
  }

  // TODO: compute "current page" input as well
  return (
    <Compute input={[config.items, config.count, config.currentPage]}>
      {({ data: [rows, count, page] }) => (
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
            {rows &&
              // TODO: fix "createQuery" function to provide variables dynamically
              rows.map(row => (
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
                      onPageClick={changePage}
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

// TODO: apply progressive disclosure technique for pagination and
// other optional stuff. (probably with accordion for the section?)
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
            <Field name="items" type="text" component={Expression} />
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
              <Label title="Total count">
                <Field name="count" type="text" component={Expression} />
              </Label>
            </Row>
            <Row>
              <Label title="Current page">
                <Field name="currentPage" type="text" component={Expression} />
              </Label>
            </Row>
            <Row>
              <Label title="Items per page">
                <Field name="limit" type="number" component={Input} />
              </Label>
            </Row>
          </>
        )}
      </Section>
    </Form>
  )
}

// TODO: remove parsing to int and have limit as integer in config instead
export const createLocalVariables = (config, state) => ({
  limit: +config.limit,
  // TODO: offset should be based on computed page value from config not from state
  offset: +config.limit * state.page,
  // TODO: local page variable also should be based on computed page from config, not from state
  page: state.page,
})

export const initialState = {
  page: 0,
}

export const defaultConfig = {
  items: "",
  pagination: true,
  currentPage: "~page",
}

export const validationSchema = yup.object().shape({
  items: yup.string(),
  limit: yup.string().required(),
  pagination: yup.boolean().required(),
  currentPage: yup.string(),
  // TODO: depending whether pagination is selected, other values are required
})

export const size = {
  w: 8,
  h: 6,
}
