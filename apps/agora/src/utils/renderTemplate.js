// TODO: will be replaced by @sourceface/template
import * as R from "ramda"
import Mustache from "mustache"

export default (template, args) => {
  // TODO: how to validate that user passed all arguments?
  // TODO: how to have optional parameters?
  // detect whether query has no defined arguments
  //
  // Temporary solution. TODO: change in future.
  if (!args) return template

  // TODO: recursively traverse args object, including array
  // const escaped = R.mapObjIndexed(val => escape(val), args)

  return Mustache.render(template, args)
}

// escape database specific stuff while rendering template
// escape html
