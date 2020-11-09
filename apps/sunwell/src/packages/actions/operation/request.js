// TODO: when we call 2 the same query function at the same time, it will produce 2 corresponding
// graphq requests. Instead of that, make a request only for a first call, and the second call should
// subscribe on data changes and be resolved once cache will be populated by a first item.

export default (commandId, args, staleIds, onStale) => {
  const cached = cache.get(commandId, args)

  if (cached) {
    /**
     * Attaching listener so whenever data invalidates all callees will be
     * notified.
     */
    cache.addListener(commandId, onStale)
    return cached
  }

  /**
   * Returning Promise only if cache is empty and we need to fetch.
   */
  // TODO: use fetch polyfill?
  return fetch("http://localhost:5001/graphql", {
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
    .then((res) => {
      if (!res.ok) {
        throw "Failed to fetch command"
      }

      return res.json()
    })
    .then((json) => {
      if (json.errors) {
        // TODO: create error class
        throw json.errors
      }

      const data = json.data.readCommand

      cache.set(commandId, args, data, onStale)

      for (let staleId of staleIds) {
        cache.invalidate(staleId)
      }

      return data
    })
}

const TTL = 3 * 60 * 1000

/**
 * Simplest form of caching. Storing queries results by it's arguments.
 */
class Cache {
  constructor() {
    this.store = {}
    this.timeouts = {}
    this.listeners = {}
  }

  get(commandId, args) {
    const commands = this.store[commandId]
    return commands && commands[this.stringify(args)]
  }

  set(commandId, args, data, onStale) {
    const key = this.stringify(args)
    const timeoutKey = this.stringify([commandId, args])

    clearTimeout(this.timeouts[timeoutKey])

    this.store[commandId] = {
      ...this.store[commandId],
      [key]: data,
    }

    if (onStale) {
      this.addListener(commandId, onStale)
    }

    this.timeouts[timeoutKey] = setTimeout(() => {
      delete this.store[commandId]
      this.removeListener(commandId, onStale)
    }, TTL)
  }

  invalidate(commandId) {
    delete this.store[commandId]

    this.notify(commandId)
    this.clearListeners()
  }

  notify(commandId) {
    for (let listener of this.listeners[commandId] || []) {
      listener()
    }
  }

  addListener(commandId, onStale) {
    const prevListeners = this.listeners[commandId] || []

    this.listeners[commandId] = [...prevListeners, onStale]
  }

  removeListener(commandId, onStale) {
    const prevListeners = this.listeners[commandId] || []

    this.listeners[commandId] = prevListeners.filter((x) => x !== onStale)
  }

  clearListeners(commandId) {
    delete this.listeners[commandId]
  }

  stringify(args) {
    return JSON.stringify(args) || ""
  }
}

let cache = new Cache()

const readCommand = `
  query($commandId: Int!, $args: JSONObject) {
    readCommand(commandId: $commandId, args: $args)
  }
`

export { cache }
