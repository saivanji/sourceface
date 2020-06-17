import * as R from "ramda";
import * as postgres from "./postgres";

const databases = { postgres };

const mock = async db => {
  await db.drop();
  await db.migrate();
  await db.seed();
};

(async function () {
  try {
    const [, , dbName] = process.argv;

    if (dbName && !Object.keys(databases).includes(dbName)) {
      throw new Error("No such database");
    }

    if (dbName) {
      await mock(databases[dbName]);
    } else {
      await Promise.all(R.values(databases).map(mock));
    }

    console.log("Mocks were applied successfully");
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
