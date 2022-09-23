import { assertEquals } from "https://deno.land/std@0.156.0/testing/asserts.ts";
import { token, tokenize } from "./tokenize.ts";

Deno.test("tokenize", () => {
  assertEquals(
    tokenize(""),
    [],
  );
  assertEquals(
    tokenize("(aaa OR (NOT aaa)) -> a AND b"),
    [
      token("left_parenthesis", 0),
      token("variable", 1, "aaa"),
      token("disjunction", 5),
      token("left_parenthesis", 8),
      token("negation", 9),
      token("variable", 13, "aaa"),
      token("right_parenthesis", 16),
      token("right_parenthesis", 17),
      token("implication", 19),
      token("variable", 22, "a"),
      token("conjunction", 24),
      token("variable", 28, "b"),
    ],
  );
});
