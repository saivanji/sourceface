import React from "react"
import * as yup from "yup"
import moment from "moment"
import {
  Await,
  Table,
  Pagination,
  Row,
  Label,
  Section,
  Input,
  Checkbox,
} from "@sourceface/components"
import { useTransition, useValue } from "packages/factory"
import { Field, Pipe } from "packages/toolkit"
import styles from "./index.scss"

// TODO: filters might be displayed in place of a column(filtered column will have gray rounded bg and "i" icon. When user will hover it - will display applied filters)

// TODO: implement actions. on clicking button - execute query. or open another page

export const Root = function TableModule({ config, scope: { limit, offset } }) {
  const changePage = useTransition("page")

  // TODO: page is not changing, the change is reflected only after edit mode is toggled.
  const [[rows, count, page], loading, pristine] = useValue(
    config.items,
    config.count,
    config.currentPage
  )

  if (!config.items) {
    return <div>No items</div>
  }

  return pristine ? (
    "Loading..."
  ) : (
    <Await isAwaiting={loading} className={styles.root}>
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
          {rows.map((row) => (
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
    </Await>
  )
}

// TODO: apply progressive disclosure technique for pagination and
// other optional stuff. (probably with accordion for the section?)
export const Configuration = function TableModuleConfiguration({ config }) {
  return (
    <>
      <Section title="Basic">
        <Row>
          <Label title="Data">
            <Field name="data" component={Pipe} />
          </Label>
        </Row>
        <Row>
          <Label title="Data">
            <Field name="items" component={Pipe} />
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
                <Field name="count" component={Pipe} />
              </Label>
            </Row>
            <Row>
              <Label title="Current page">
                <Field name="currentPage" type="text" component={Pipe} />
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
    </>
  )
}

// TODO: remove parsing to int and have limit as integer in config instead
export const createLocalVariables = (config, state, updateState) => ({
  limit: +config.limit,
  // TODO: offset should be based on computed page value from config not from state
  offset: +config.limit * state.page,
  // TODO: local page variable also should be based on computed page from config, not from state
  page: state.page,
  // TODO: computed variables are executed only when used in order not to calculate everything when
  // module is initiated since some variables might be used only in future. Use getter feature for that?(might not work,
  // since local variables used in render. As alternative access local variables with component, or improve Compute
  // component in order to support computing local variables). Also local variables are used for computing, not only in
  // react components.
  //
  // Two ways of using computing local variables:
  // 1. To render it's data in the component. In that case improved "Compute" component may be used to compute the value.
  // 2. To use it's value when computing another code. In that case the value will be computed when its needed.
  //
  // TODO: think of real use-case of the above. Is that really needed? Probably postpone that feature until it will be
  // really needed and start implementing new modules now?
  //
  // TODO: use memoization for computing in order not to send the same request when arguments are not changed
  //
  // _page: compute(config.currentPage),
  // _offset: compute(config.currentPage, currentPage => currentPage * config.limit)
  test: {
    x: 1,
    y: 2,
  },
})

export const initialState = {
  page: 0,
}

export const defaultConfig = {
  pagination: true,
  // currentPage: "~page",
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
