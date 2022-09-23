import { assertEquals } from "./deps-test.ts";
import { t, Token, tokenize, v } from "./tokenize.ts";

const tests: [string, Token[]][] = [
  ["", []],
  ["NOT x", [t("NOT", 0), v("x", 4)]],
  ["(aaa OR (NOT aaa)) -> a AND b", [
    t("(", 0),
    v("aaa", 1),
    t("OR", 5),
    t("(", 8),
    t("NOT", 9),
    v("aaa", 13),
    t(")", 16),
    t(")", 17),
    t("->", 19),
    v("a", 22),
    t("AND", 24),
    v("b", 28),
  ]],
];

tests.forEach(([formula, expected]) => {
  Deno.test(`tokenize "${formula}"`, () => {
    assertEquals(tokenize(formula), expected);
  });
});
