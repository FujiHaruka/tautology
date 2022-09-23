import { Formula } from "./Formula.ts"

export function parse(formulaStr: string): Formula {
  return Formula.parse(formulaStr)
}
