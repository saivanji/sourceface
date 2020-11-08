export default class {
  constructor() {
    this.store = {}
  }

  async apply(id, args, fn, ttl) {
    const key = this.stringify(id, args)
    const cached = this.get(key)

    if (cached) {
      return cached
    }

    const data = await fn(...args)
    this.set(key, data, ttl)
    return data
  }

  set(key, data, ttl = 3 * 60 * 1000) {
    this.clearTimeout(key)
    const timeout = setTimeout(() => this.purge(key), ttl)

    this.store[key] = {
      data,
      timeout,
    }
  }

  get(key) {
    return this.store[key]?.data
  }

  purge(key) {
    delete this.store[key]
  }

  clearTimeout(key) {
    const timeout = this.store[key]?.timeout

    if (timeout) {
      clearTimeout(timeout)
    }
  }

  stringify(id, args) {
    return JSON.stringify([id, args])
  }
}
