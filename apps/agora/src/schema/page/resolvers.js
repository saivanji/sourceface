import * as pageRepo from "repos/page"

const page = async (parent, { pageId }, { pg }) => {
  return await pageRepo.one(pageId, pg)
}

const layout = async ({ layoutId }, args, ctx) => {
  return ctx.loaders.layout.load(layoutId)
}

export default {
  Query: {
    page,
  },
  Page: {
    layout,
  },
}
