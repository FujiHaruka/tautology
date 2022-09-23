import { assertEquals } from "./deps-test.ts";
import { Formula } from "./Formula.ts";

const testsEstimate: [string, Record<string, boolean>, boolean][] = [
  ["var", { var: true }, true],
  ["var", { var: false }, false],

  ["NOT var", { var: true }, false],
  ["NOT var", { var: false }, true],

  ["a OR b", { a: true, b: true }, true],
  ["a OR b", { a: true, b: false }, true],
  ["a OR b", { a: false, b: true }, true],
  ["a OR b", { a: false, b: false }, false],

  ["a AND b", { a: true, b: true }, true],
  ["a AND b", { a: true, b: false }, false],
  ["a AND b", { a: false, b: true }, false],
  ["a AND b", { a: false, b: false }, false],

  ["a -> b", { a: true, b: true }, true],
  ["a -> b", { a: true, b: false }, false],
  ["a -> b", { a: false, b: true }, true],
  ["a -> b", { a: false, b: false }, true],

  ["a -> a -> a", { a: true }, true],
  ["a -> a -> a", { a: false }, true],

  ["a OR b -> NOT c", { a: true, b: true, c: true }, false],
  ["a OR b -> NOT c", { a: false, b: true, c: true }, false],
  ["a OR b -> NOT c", { a: true, b: false, c: true }, false],
  ["a OR b -> NOT c", { a: true, b: true, c: false }, true],
  ["a OR b -> NOT c", { a: false, b: false, c: true }, true],
  ["a OR b -> NOT c", { a: false, b: true, c: false }, true],
  ["a OR b -> NOT c", { a: true, b: false, c: false }, true],
  ["a OR b -> NOT c", { a: false, b: false, c: false }, true],
];

testsEstimate.forEach(([code, variables, expected]) => {
  Deno.test(`Formula / estimate "${code}" with ${JSON.stringify(variables)}`, () => {
    const formula = Formula.parse(code);
    assertEquals(formula.estimate(variables), expected);
  });
});
