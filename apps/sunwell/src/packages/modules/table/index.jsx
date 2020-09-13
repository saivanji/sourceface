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
  useVariables,
  useConnectedState,
} from "packages/toolkit"
import styles from "./index.scss"

// TODO: clarify difference between scope, constants and variables. Fix naming issues.
// Will have only "scope", constants and variables are not needed.
// TODO: consider merging funcs and constants. why there is a such separation in the engine?

// TODO: implement actions. on clicking button - execute query. or open another page

// TODO: remember engine implementation for additional context

// TODO: consider implementing hooks api instead of Compute

// TODO: implement "input" module and make search over table feature

// TODO: rename useVariables to useLocal. or better have "local" module prop

export const Root = function TableModule({ config, state, local }) {
  // TODO: move "state" to props and have `const changePage = useTransition("page")` instead?
  const [page, setPage] = useConnectedState("page")
  // TODO: should put to props? or get config with hook instead?
  const { limit, offset } = useVariables()

  if (!config.items) {
    return <div>No items</div>
  }

  // TODO: compute "current page" input as well
  return (
    <Compute input={[config.items, config.count]}>
      {({ data: [rows, count] }) => (
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
export const createVariables = (config, state) => ({
  limit: +config.limit,
  offset: +config.limit * state.page,
})

export const initialState = {
  page: 0,
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
