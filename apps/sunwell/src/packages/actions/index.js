import { toList } from "./utils"

import * as redirect from "./redirect"
import * as runQuery from "./runQuery"

export const dict = { redirect, runQuery }
export const list = toList(dict)
