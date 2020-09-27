import { readCommand } from "./queries"

export default async ({ commandId, args }) => {
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

  return (await res.json()).data.readCommand
}

let cache = {}
