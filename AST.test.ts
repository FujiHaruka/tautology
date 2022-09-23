import { assertEquals } from "https://deno.land/std@0.156.0/testing/asserts.ts";
import { orderByRPN } from "./AST.ts";
import { Token, token } from "./tokenize.ts";

function fmt(tokens: Token[]) {
  return tokens.map((token) => token.value).join(" ");
}

Deno.test("AST / orderByRPN", () => {
  // "a OR b"
  assertEquals(
    fmt(orderByRPN([
      token("variable", 0, "a"),
      token("disjunction", 0),
      token("variable", 0, "b"),
    ])),
    "a b OR",
  );

  // "a OR b -> c"
  assertEquals(
    fmt(orderByRPN([
      token("variable", 0, "a"),
      token("disjunction", 0),
      token("variable", 0, "b"),
      token("implication", 0),
      token("variable", 0, "c"),
    ])),
    "a b OR c ->",
  );

  // "a -> b OR c"
  assertEquals(
    fmt(orderByRPN([
      token("variable", 0, "a"),
      token("implication", 0),
      token("variable", 0, "b"),
      token("disjunction", 0),
      token("variable", 0, "c"),
    ])),
    "a b c OR ->",
  );

  // "(a -> b) OR c"
  assertEquals(
    fmt(orderByRPN([
      token("left_parenthesis", 0),
      token("variable", 0, "a"),
      token("implication", 0),
      token("variable", 0, "b"),
      token("right_parenthesis", 0),
      token("disjunction", 0),
      token("variable", 0, "c"),
    ])),
    "a b -> c OR",
  );
});
