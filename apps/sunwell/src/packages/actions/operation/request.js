// TODO: when we call 2 the same query function at the same time, it will produce 2 corresponding
// graphq requests. Instead of that, make a request only for a first call, and the second call should
// subscribe on data changes and be resolved once cache will be populated by a first item.

export default (operationId, args, staleIds, onStale) => {
  const cached = cache.get(operationId, args)

  if (cached) {
    /**
     * Attaching listener so whenever data invalidates all callees will be
     * notified.
     */
    cache.addListener(operationId, onStale)
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
      query: readOperation,
      variables: {
        operationId,
        args,
      },
    }),
  })
    .then((res) => {
      if (!res.ok) {
        throw "Failed to fetch operation"
      }

      return res.json()
    })
    .then((json) => {
      if (json.errors) {
        // TODO: create error class
        throw json.errors
      }

      const data = json.data.readOperation

      cache.set(operationId, args, data, onStale)

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

  get(operationId, args) {
    const operations = this.store[operationId]
    return operations && operations[this.stringify(args)]
  }

  set(operationId, args, data, onStale) {
    const key = this.stringify(args)
    const timeoutKey = this.stringify([operationId, args])

    clearTimeout(this.timeouts[timeoutKey])

    this.store[operationId] = {
      ...this.store[operationId],
      [key]: data,
    }

    if (onStale) {
      this.addListener(operationId, onStale)
    }

    this.timeouts[timeoutKey] = setTimeout(() => {
      delete this.store[operationId]
      this.removeListener(operationId, onStale)
    }, TTL)
  }

  invalidate(operationId) {
    delete this.store[operationId]

    this.notify(operationId)
    this.clearListeners()
  }

  notify(operationId) {
    for (let listener of this.listeners[operationId] || []) {
      listener()
    }
  }

  addListener(operationId, onStale) {
    const prevListeners = this.listeners[operationId] || []

    this.listeners[operationId] = [...prevListeners, onStale]
  }

  removeListener(operationId, onStale) {
    const prevListeners = this.listeners[operationId] || []

    this.listeners[operationId] = prevListeners.filter((x) => x !== onStale)
  }

  clearListeners(operationId) {
    delete this.listeners[operationId]
  }

  stringify(args) {
    return JSON.stringify(args) || ""
  }
}

let cache = new Cache()

const readOperation = `
  query($operationId: Int!, $args: JSONObject) {
    readOperation(operationId: $operationId, args: $args)
  }
`

export { cache }
