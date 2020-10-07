/**
 * Syntax code analysis and parsing to a structure.
 */
export const parse = (input, options) => {}

export class Literal {
  constructor(value) {
    this.value = value
  }

  toJSON() {}
}

export class Constant {
  constructor(path) {
    this.path = path
  }

  toJSON() {}
}

export class Call {
  constructor(path, args) {
    this.constant = new Constant(path)
    this.args = args
  }

  toJSON() {}
}

export class Definition {
  constructor(result, parameters) {
    this.result = result
    this.parameters = parameters
  }

  toJSON() {}
}
