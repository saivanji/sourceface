/**
 * Creating scope to be used in module.
 */
export const createScope = (commands, constants) => ({
  funcs: {
    commands: commands.reduce(
      (acc, command) => ({
        ...acc,
        [command.id]: args => ({
          type: "command",
          payload: {
            commandId: command.id,
            args,
          },
        }),
      }),
      {}
    ),
  },
  constants,
  // constants: {
  //   local: {},
  //   TODO: probably not include "modules" in 1st release
  //   modules: {}
  // }
})
