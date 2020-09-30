import { readCommand } from "./queries"

const executeCommand = async ({ commandId, args }) => {
  /**
   * Returning Promise only if cache is empty and we need to fetch.
   */
  const res = await fetch("http://localhost:5001/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      query: readCommand,
      variables: {
        commandId,
        args,
      },
    }),
  })

  if (!res.ok) {
    throw "Failed to fetch command"
  }

  const data = (await res.json()).data.readCommand

  cache.set(commandId, args, data)

  return data
}

/**
 * Simplest form of caching. Storing queries results by it's arguments. Useful
 * unless we need to perform custom cache update(for example after entry deletion or
 * creation).
 */
class Cache {
  constructor() {
    this.store = {}
  }

  selector(commandId, args) {
    return JSON.stringify({ commandId, args })
  }

  get(commandId, args) {
    return this.store[this.selector(commandId, args)]
  }

  set(commandId, args, data) {
    this.store[this.selector(commandId, args)] = data
  }
}

let cache = new Cache()

executeCommand.cache = cache.get.bind(cache)

export default executeCommand
