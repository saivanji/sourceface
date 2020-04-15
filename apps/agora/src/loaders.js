import * as R from "ramda"
import DataLoader from "dataloader"
import * as roleRepo from "repos/role"

export default (pg) => {
  const role = new DataLoader((ids) => roleRepo.byIds(ids, pg))

  return {
    role,
  }
}
