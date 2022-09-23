import { assertEquals } from "https://deno.land/std@0.156.0/testing/asserts.ts";
import { Stack } from "./utils.ts";

Deno.test("Stack", () => {
  const stack = new Stack<number>();

  assertEquals(stack.top, undefined);
  assertEquals(stack.pop(), undefined);
  stack.push(1);
  assertEquals(stack.top, 1);
  assertEquals(stack.pop(), 1);
  assertEquals(stack.pop(), undefined);
  stack.push(2);
  stack.push(3);
  assertEquals(stack.top, 3);
  assertEquals(stack.pop(), 3);
  assertEquals(stack.top, 2);
  stack.push(4);
  stack.push(5);
  assertEquals(stack.top, 5);
  assertEquals(stack.pop(), 5);
  assertEquals(stack.top, 4);
  assertEquals(stack.popAll(), [4, 2]);
});
