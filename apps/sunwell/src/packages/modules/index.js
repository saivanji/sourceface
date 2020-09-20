// TODO: keep modules in a separate package so back-end can import validation schema for validating create/update module requests

import { values } from "ramda"
import { transformModules } from "./utils"

import * as button from "./button"
import * as container from "./container"
import * as input from "./input"
import * as table from "./table"
import * as text from "./text"

const stock = { button, container, input, table, text }

export const dict = transformModules(stock)
export const list = values(dict)
