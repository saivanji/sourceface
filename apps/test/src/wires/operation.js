import { times } from "ramda";
import faker from "faker";

faker.seed(1);

export function execute(args, { root }) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(controllers[root.name](args));
    }, Math.random() * 1000);
  });
}

export const groupCache = () => {};

const controllers = {
  ordersList: ({ limit, offset }) =>
    db.ordersList.slice(offset, offset + limit),
};

const db = {
  ordersList: times(
    (i) => ({
      id: i,
      customer_name: `${faker.name.firstName()} ${faker.name.lastName()}`,
      address: faker.address.streetAddress(),
      delivery_type: faker.random.arrayElement(["delivery", "pickup"]),
      status: faker.random.arrayElement([
        "pending",
        "in_progress",
        "dispatched",
        "delivered",
        "canceled",
      ]),
      payment_type: faker.random.arrayElement(["credit_card", "cash"]),
      amount: faker.finance.amount(),
      currency: faker.finance.currencyCode(),
    }),
    200
  ),
};
