import { times } from "ramda";
import moment from "moment";
import faker from "faker";

faker.seed(1);

export function execute(operation, args) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(controllers[operation.name](args));
    }, Math.random() * 1000);
  });
}

export const getStaleIds = (operation) => operation.stale.map((o) => o.id);
export const select = (references) => references.root;
export const referenceType = "operation";

const controllers = {
  ordersList: ({ limit, offset }) => db.orders.slice(offset, offset + limit),
  removeOrder: ({ id }) => {
    db.orders = db.orders.filter((order) => order.id !== id);
  },
  updateOrder: ({ id, customer_name, address }) => {
    db.orders = db.orders.map((order) =>
      order.id !== id
        ? order
        : {
            ...order,
            customer_name,
            address,
          }
    );
  },
  createOrder: ({ customer_name, address }) => {
    const order = createOrder(db.orders.length, customer_name, address);

    db.orders = [order, ...db.orders];

    return order;
  },
  order: ({ id }) => db.orders.find((o) => o.id === id),
};

const db = {
  orders: times(createOrder, 200),
};

function createOrder(id, customerName, address) {
  return {
    id,
    created_at: moment().format(),
    customer_name:
      customerName || `${faker.name.firstName()} ${faker.name.lastName()}`,
    address: address || faker.address.streetAddress(),
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
  };
}
