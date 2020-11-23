export const up = () =>
  global.pg.tx(async (t) => {
    await t.none(`
      CREATE OR REPLACE FUNCTION jsonb_recursive_merge(orig jsonb, delta jsonb)
      RETURNS jsonb LANGUAGE SQL AS $$
        SELECT
          jsonb_object_agg(
            coalesce(keyOrig, keyDelta),
            CASE
              WHEN valOrig isnull THEN valDelta
              WHEN valDelta isnull THEN valOrig
              WHEN (jsonb_typeof(valOrig) <> 'object' OR jsonb_typeof(valDelta) <> 'object') THEN valDelta
              ELSE jsonb_recursive_merge(valOrig, valDelta)
            END
          )
        FROM jsonb_each(orig) e1(keyOrig, valOrig)
        FULL JOIN jsonb_each(delta) e2(keyDelta, valDelta) ON keyOrig = keyDelta
      $$;
    `)
  })

export const down = () =>
  global.pg.tx(async (t) => {
    await t.none(`
      DROP FUNCTION jsonb_recursive_merge
    `)
  })
