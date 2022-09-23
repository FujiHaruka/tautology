import { assertEquals } from "https://deno.land/std@0.156.0/testing/asserts.ts";
import { orderByRPN } from "./AST.ts";
import { t, Token, TokenValue, v } from "./tokenize.ts";

function fmt(tokens: Token[]) {
  return tokens.map((token) => token.value).join(" ");
}

function fromNormalizedFormula(formula: string): Token[] {
  return formula.split(" ")
    .filter(Boolean)
    .map((value) => {
      if (/^[a-z]+$/.test(value)) {
        return v(value);
      } else {
        return t(value as TokenValue);
      }
    });
}

const testsOrderByRPN: [string, string][] = [
  ["", ""],
  ["a", "a"],
  ["a OR b", "a b OR"],
  ["a OR b -> c", "a b OR c ->"],
  ["a -> b OR c", "a b c OR ->"],
  ["( a -> b ) OR c", "a b -> c OR"],
  [
    "( a AND b ) OR ( ( c AND d ) -> ( e AND f ) )",
    "a b AND c d AND e f AND -> OR",
  ],
  ["NOT a", "a NOT"],
  ["NOT NOT NOT a", "a NOT NOT NOT"],
  ["NOT ( NOT ( NOT a ) )", "a NOT NOT NOT"],
  ["NOT a AND b", "a NOT b AND"],
  ["a AND NOT b", "a b NOT AND"],
  ["a AND NOT NOT ( b OR c )", "a b c OR NOT NOT AND"],
];

testsOrderByRPN.forEach(([formula, expected]) => {
  Deno.test(`orderByRPN with "${formula}"`, () => {
    assertEquals(fmt(orderByRPN(fromNormalizedFormula(formula))), expected);
  });
});
