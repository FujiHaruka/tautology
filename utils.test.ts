import { assertEquals, assertThrows } from "./deps-test.ts";
import { Stack } from "./utils.ts";

Deno.test("Stack / push and pop", () => {
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

Deno.test("Stack / popForce", () => {
  const stack = new Stack<number>();

  assertThrows(() => stack.popForce());
  stack.push(1);
  assertEquals(stack.top, 1);
  assertEquals(stack.popForce(), 1);
  assertEquals(stack.top, undefined);
});
