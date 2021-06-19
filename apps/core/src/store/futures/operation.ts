import { times } from "ramda";
import moment from "moment";
import faker from "faker";
import type { References } from "../../types";

faker.seed(1);

type Args =
  | OrdersListArgs
  | RemoveOrderArgs
  | UpdateOrderArgs
  | CreateOrderArgs
  | OrderArgs;

type OrdersListArgs = { limit: number; offset: number };
type RemoveOrderArgs = { id: number };
type UpdateOrderArgs = {
  id: number;
  customer_name: string;
  address: string;
};
type CreateOrderArgs = {
  customer_name: string;
  address: string;
};
type OrderArgs = { id: number };

export function execute(references: References, args: Args) {
  const operationId = references?.operations?.root;

  if (typeof operationId === "undefined") {
    throw new Error("Can not find 'root' operation reference");
  }

  if (!(operationId in ids)) {
    throw new Error("Unknown operation id");
  }

  type OperationId = keyof typeof ids;
  type OperationName = keyof typeof controllers;

  const operationName = ids[operationId as OperationId] as OperationName;

  return new Promise((resolve) => {
    setTimeout(() => {
      const fn = controllers[operationName];

      resolve(fn(args as any));
    }, Math.random() * 1000);
  });
}

const controllers = {
  ordersList: ({ limit, offset }: OrdersListArgs) => ({
    data: db.orders.slice(offset, offset + limit),
  }),
  removeOrder: ({ id }: RemoveOrderArgs) => {
    db.orders = db.orders.filter((order) => order.id !== id);
    return { stale: [1] };
  },
  updateOrder: ({ id, customer_name, address }: UpdateOrderArgs) => {
    db.orders = db.orders.map((order) =>
      order.id !== id
        ? order
        : {
            ...order,
            customer_name,
            address,
          }
    );
    return { stale: [1] };
  },
  createOrder: ({ customer_name, address }: CreateOrderArgs) => {
    const order = createOrder(db.orders.length, customer_name, address);

    db.orders = [order, ...db.orders];

    return { data: order, stale: [1] };
  },
  order: ({ id }: OrderArgs) => ({ data: db.orders.find((o) => o.id === id) }),
};

const ids = {
  1: "ordersList",
  2: "removeOrder",
  3: "updateOrder",
  4: "createOrder",
  5: "order",
};

const db = {
  orders: times((id) => createOrder(id), 200),
};

function createOrder(id: number, customerName?: string, address?: string) {
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
