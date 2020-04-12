import * as R from "ramda"
import DataLoader from "dataloader"
import * as roleRepo from "repos/role"

export default (pg) => {
  const role = new DataLoader(async (ids) =>
    (await roleRepo.list(ids, pg)).map(R.prop("name"))
  )

  return {
    role,
  }
}
