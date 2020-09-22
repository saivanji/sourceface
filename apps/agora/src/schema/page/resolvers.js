import * as pageRepo from "repos/page"

const page = async (parent, { path }, { pg }) =>
  await pageRepo.oneByPath(path, pg)

const layout = async ({ layoutId }, args, ctx) =>
  ctx.loaders.layout.load(layoutId)

const modules = async (parent, args, ctx) =>
  ctx.loaders.modulesByPage.load(parent.id)

export default {
  Query: {
    page,
  },
  Page: {
    layout,
    modules,
  },
}
