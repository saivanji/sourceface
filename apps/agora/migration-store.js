const pg = require('./postgres');

function Store() {}

Store.prototype.load = async function(cb) {
  const tableExists = await pg.oneOrNone(`
    SELECT * FROM information_schema.tables
    WHERE table_name = 'migrations'
  `);

  // We're running `load` first time.
  if (!tableExists) {
    return cb(null, {});
  }

  const res = await pg.oneOrNone('SELECT * FROM migrations');
  cb(null, res ? res.data : {});
};

Store.prototype.save = async function(set, cb) {
  await pg.none(`
    CREATE TABLE IF NOT EXISTS migrations (
      data jsonb NOT NULL
    )
  `);

  const res = await pg.oneOrNone('SELECT * FROM migrations');
  const payload = {
    lastRun: set.lastRun,
    migrations: set.migrations,
  };

  if (!res) {
    await pg.none(`INSERT INTO migrations (data) VALUES ($1)`, [payload]);
  } else {
    await pg.none(`UPDATE migrations SET data = $1`, [payload]);
  }

  cb();
};

module.exports = Store;
