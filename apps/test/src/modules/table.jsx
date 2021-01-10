import React from "react";
import moment from "moment";
import Pagination from "react-js-pagination";

export function Root({ settings: [data], variables: [page], onStateChange }) {
  const thClassName = "border-b border-gray-300 pb-3 pr-4 text-left";
  const tdClassName = "border-b border-gray-200 py-3 pr-4 text-left";

  const changePage = (page) => onStateChange({ page: page - 1 });

  return (
    <table>
      <thead>
        <tr>
          <th className={thClassName}>Id</th>
          <th className={thClassName}>Date</th>
          <th className={thClassName}>Customer</th>
          <th className={thClassName}>Address</th>
          <th className={thClassName}>Delivery type</th>
          <th className={thClassName}>Status</th>
          <th className={thClassName}>Payment type</th>
          <th className={thClassName}>Amount</th>
        </tr>
      </thead>
      <tbody>
        {data?.map((row) => (
          <tr key={row.id}>
            <td className={tdClassName}>{row.id}</td>
            <td className={tdClassName}>
              {moment(row.created_at).format("DD MMM YY, HH:mm")}
            </td>
            <td className={tdClassName}>{row.customer_name}</td>
            <td className={tdClassName}>{row.address}</td>
            <td className={tdClassName}>{row.delivery_type}</td>
            <td className={tdClassName}>{row.status}</td>
            <td className={tdClassName}>{row.payment_type}</td>
            <td className={tdClassName}>
              {row.amount} {row.currency}
            </td>
          </tr>
        ))}
      </tbody>
      <tfoot>
        <tr>
          <td colSpan={8} className="pt-3">
            <div className="flex justify-end">
              <Pagination
                hideDisabled
                innerClass="flex"
                linkClass="px-2 py-1 block rounded hover:bg-gray-100"
                activeLinkClass="bg-gray-200"
                activePage={page + 1}
                itemsCountPerPage={10}
                totalItemsCount={450}
                pageRangeDisplayed={5}
                onChange={changePage}
              />
            </div>
          </td>
        </tr>
      </tfoot>
    </table>
  );
}

Root.settings = ["data"];
Root.variables = ["page"];

export const variables = {
  page: {
    selector: (state, { settings: [page] }) => page ?? state.page,
    settings: ["page"],
    type: "Number",
  },
  limit: {
    selector: (state, { settings: [limit] }) => limit,
    settings: ["limit"],
    type: "Number",
  },
  offset: {
    selector: (state, { variables: [page, limit] }) => limit * page,
    variables: ["page", "limit"],
    type: "Number",
  },
};

export const initialState = {
  page: 0,
};
