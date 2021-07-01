import { times } from "ramda";
import moment from "moment";
import faker from "faker";

faker.seed(1);

export function execute(args, references) {
  const operationId = references?.operations?.root;

  if (typeof operationId === "undefined") {
    throw new Error("Can not find 'root' operation reference");
  }

  if (!(operationId in ids)) {
    throw new Error("Unknown operation id");
  }

  const operationName = ids[operationId];

  return new Promise((resolve) => {
    setTimeout(() => {
      const fn = controllers[operationName];

      resolve(fn(args));
    }, Math.random() * 1000);
  });
}

const controllers = {
  ordersList: ({ limit, offset }) => ({
    data: db.orders.slice(offset, offset + limit),
  }),
  removeOrder: ({ id }) => {
    db.orders = db.orders.filter((order) => order.id !== id);
    return { data: null, stale: [1] };
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
    return { data: null, stale: [1] };
  },
  createOrder: ({ customer_name, address }) => {
    const order = createOrder(db.orders.length, customer_name, address);

    db.orders = [order, ...db.orders];

    return { data: order, stale: [1] };
  },
  order: ({ id }) => ({ data: db.orders.find((o) => o.id === id) }),
  echo: () => ({ data: "Hello from the operation" }),
};

const ids = {
  1: "ordersList",
  2: "removeOrder",
  3: "updateOrder",
  4: "createOrder",
  5: "order",
  6: "echo",
};

const db = {
  orders: times((id) => createOrder(id), 200),
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
