export function listSuggestions(fn, value, items, map, filter, multiple) {
  return items.reduce((acc, item) => {
    const mapped = map(item)

    return !filter(mapped)
      ? acc
      : [
          ...acc,
          fn(
            mapped,
            item,
            multiple ? value.includes(mapped.value) : value === mapped.value
          ),
        ]
  }, [])
}
