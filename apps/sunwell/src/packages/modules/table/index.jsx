import React from "react"
import * as yup from "yup"
import moment from "moment"
import {
  Await,
  Table,
  Pagination,
  Input,
  Checkbox,
} from "@sourceface/components"
import { useTransition, useHandlers } from "packages/factory"
import { Option, Section } from "packages/toolkit"
import More from "assets/more.svg"
import styles from "./index.scss"

// TODO: test use case of defining "page" global state, fetching table data in parent "container" module, passing down to "table" via "mount" and paging with "on page change" field

// TODO: filters might be displayed in place of a column(filtered column will have gray rounded bg and "i" icon. When user will hover it - will display applied filters)

// TODO: implement actions. on clicking button - execute query. or open another page

// TODO: implement sub module configuration. When clicking on something inside of a module(for example column head) - display separate configuration sidebar instead of main configuration.

// TODO: how to handle dependencies between fields? For example user may fetch "page" field asynchronously and after based on "page" field fetch "data" rows. So "data" depends on "page" and needs to be fetched after it. But that behavior is defined in the user land, don't hard-code it. Define order of executions in useValues. What about useFunctions?
// TODO: how to handle circular dependencies?("data" have "count" inside and "count" have "data" inside) restrict and filter out variables in listing from one of a sides?

export const Root = function TableModule({
  isUpdating,
  data: [data, count, pagination],
  scope: [limit, offset, page],
}) {
  const [onRowClick] = useHandlers("rowClick")
  const changePage = useTransition("page")

  return (
    <Await isAwaiting={isUpdating} className={styles.root}>
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
            <Table.Th />
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {data?.map((row) => (
            <Table.Tr
              key={row.id}
              hover={!!onRowClick}
              onClick={() => onRowClick?.({ row })}
            >
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
              <Table.Td className={styles.more}>
                <More />
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
        {pagination && count && limit !== 0 && (
          <Table.Tfoot>
            <Table.Tr>
              <Table.Td colSpan={9}>
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

Root.data = ["data", "count", "pagination"]
Root.scope = ["limit", "offset", "page"]

// TODO: introduce "on page change" option for customizing paging behavior
// TODO: apply progressive disclosure technique for pagination and
// other optional stuff. (probably with accordion for the section?)
export const Configuration = function TableModuleConfiguration({ config }) {
  return (
    <>
      <Section title="Basic">
        <Option name="data" label="Data" actionsOnly />
      </Section>
      <Section title="Pagination">
        <Option
          name="pagination"
          label="Enabled"
          text="Yes"
          component={Checkbox}
        />
        {config.pagination && (
          <>
            <Option name="count" label="Total count" actionsOnly />
            <Option name="currentPage" label="Current page" />
            <Option
              name="limit"
              label="Items per page"
              type="number"
              component={Input}
            />
          </>
        )}
      </Section>
      <Section title="Row">
        <Option name="rowClick" label="Row click" actionsOnly />
      </Section>
    </>
  )
}

export const scope = {
  limit: (limit) => +limit,
  offset: (limit, state) => +limit * state.page,
  page: (state) => state.page,
}

export const dependencies = {
  scope: {
    limit: ["limit"],
    offset: ["limit"],
  },
}

// TODO: implement support of computing every config element but ideally that should be invisible
// for the module developers.
//
// Any field from a config(even boolean value like "pagination") inside of a module component should be
// used through "useValue" hook. If config value is literal then it will simple return it, if it's
// an action - execute it.
//
// In case of "createScope" function, config elements might be functions itself with similar logic.
// For literals - will be returned their values, for actions - executed

// TODO: should values be from "populated" array or all available values?
// TODO: remove parsing to int and have limit as integer in config instead
export const createScope = (data, state) => ({
  limit: +data.limit,
  // TODO: offset should be based on computed page value from config not from state
  offset: +data.limit * state.page,
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

// TODO: do we need types here? or can calculate from data?
export const variableTypes = {
  limit: "Number",
  offset: "Number",
  page: "Number",
  test: {
    x: "Number",
    y: "Number",
  },
}

export const inputTypes = {
  rowClick: {
    row: "",
  },
}

export const initialState = {
  page: 0,
}

export const defaults = {
  pagination: true,
  limit: 10,
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
