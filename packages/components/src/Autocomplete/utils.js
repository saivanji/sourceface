export function listSuggestions(fn, value, items, map, filter) {
  return items.reduce((acc, item) => {
    const mapped = map(item)

    return !filter(mapped) ? acc : [...acc, fn(mapped, item, value === mapped.value)]
  }, [])
}
