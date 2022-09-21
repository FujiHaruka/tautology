import { assertEquals } from "https://deno.land/std@0.156.0/testing/asserts.ts";
import {
  conjunctionToken,
  disjunctionToken,
  implicationToken,
  leftParenthesisToken,
  negationToken,
  rightParenthesisToken,
  tokenize,
  variableToken,
} from "./tokenize.ts";

Deno.test("tokenize", () => {
  assertEquals(
    tokenize(""),
    [],
  );
  assertEquals(
    tokenize("(aaa OR (NOT aaa)) -> a AND b"),
    [
      leftParenthesisToken(0),
      variableToken(1, "aaa"),
      disjunctionToken(5),
      leftParenthesisToken(8),
      negationToken(9),
      variableToken(13, "aaa"),
      rightParenthesisToken(16),
      rightParenthesisToken(17),
      implicationToken(19),
      variableToken(22, "a"),
      conjunctionToken(24),
      variableToken(28, "b"),
    ],
  );
});
