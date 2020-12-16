import UrlPattern from "url-pattern"
import { useContainer } from "./container"

export function useParams(path) {
  const { page } = useContainer()
  const pattern = new UrlPattern(page.route)

  return pattern.match(path)
}
