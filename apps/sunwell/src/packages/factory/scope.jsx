export const useScope = (...fields) => {
  return [[], { isUpdating: false, isPristine: true, error: null }]
}
