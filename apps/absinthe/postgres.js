import pgPromise from "pg-promise";
import * as R from "ramda";
import faker from "faker";

faker.seed(1);

const pgp = pgPromise();
const cn = pgp(process.env.POSTGRES_URL);

export const drop = () =>
  cn.none(
    `DROP SCHEMA public CASCADE;
     CREATE SCHEMA public;`
  );

// TODO:
// 1. Store address as a separate table
export const migrate = () =>
  cn.none(
    `CREATE TABLE orders(
       id serial PRIMARY KEY,
       created_at timestamp NOT NULL DEFAULT NOW(),
       customer_name text NOT NULL CHECK (
         customer_name <> ''
       ),
       address text NOT NULL CHECK (
         address <> ''
       ),
       delivery_type text NOT NULL CHECK (
         delivery_type = 'delivery' OR
         delivery_type = 'pickup'
       ),
       status text NOT NULL CHECK (
         status = 'pending' OR
         status = 'in_progress' OR
         status = 'dispatched' OR
         status = 'delivered' OR
         status = 'canceled'
       ),
       payment_type text NOT NULL CHECK (
         payment_type = 'credit_card' OR
         payment_type = 'cash'
       ),
       amount float NOT NULL,
       currency text NOT NULL CHECK (
         currency <> ''
       )
    );`
  );

export const seed = async () => {
  /** Orders **/
  await insert(
    R.times(
      () => ({
        customer_name: `${faker.name.firstName()} ${faker.name.lastName()}`,
        address: faker.address.streetAddress(),
        delivery_type: faker.random.arrayElement(["delivery", "pickup"]),
        status: faker.random.arrayElement([
          "pending",
          "in_progress",
          "dispatched",
          "delivered",
          "canceled"
        ]),
        payment_type: faker.random.arrayElement(["credit_card", "cash"]),
        amount: faker.finance.amount(),
        currency: faker.finance.currencyCode()
      }),
      200
    ),
    [
      "customer_name",
      "address",
      "delivery_type",
      "status",
      "payment_type",
      "amount",
      "currency"
    ],
    "orders"
  );
};

const insert = (values, columns, table) =>
  cn.none(
    pgp.helpers.insert(values, new pgp.helpers.ColumnSet(columns, { table }))
  );
