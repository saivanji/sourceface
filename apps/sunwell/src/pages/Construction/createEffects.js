export default (history) => ({
  navigate: navigate(history),
})

const navigate = (history) => ({ to }) => history.push(`/e${to}`)
