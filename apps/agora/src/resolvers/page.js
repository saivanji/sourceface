import * as pageRepo from "repos/page"

const page = async (parent, { path }, { pg }) =>
  await pageRepo.oneByPath(path, pg)

const searchPages = (parent, { query, limit = 10, offset = 0 }, { pg }) =>
  pageRepo.search(query, limit, offset, pg)

const layout = async ({ layoutId }, args, ctx) =>
  ctx.loaders.layout.load(layoutId)

const modules = async (parent, args, ctx) =>
  ctx.loaders.modulesByPage.load(parent.id)

const trail = (parent, args, ctx) => ctx.loaders.trailByPage.load(parent.id)

export default {
  Query: {
    page,
    searchPages,
  },
  Page: {
    layout,
    modules,
    trail,
  },
}
