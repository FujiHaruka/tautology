import type { Token, UnknownToken } from "./tokenize.ts";
import { Stack } from "./utils.ts";

export type NodeType =
  | "variable"
  | "negation"
  | "conjunction"
  | "disjunction"
  | "implication";

export interface VariableNode {
  type: "variable";
  value: string;
}
export interface NegationNode {
  type: "negation";
  target: Node;
}
export interface ConjunctionNode {
  type: "conjunction";
  left: Node;
  right: Node;
}
export interface DisjucntionNode {
  type: "disjunction";
  left: Node;
  right: Node;
}
export interface ImplicationNode {
  type: "implication";
  left: Node;
  right: Node;
}

export type Node =
  | VariableNode
  | NegationNode
  | ConjunctionNode
  | DisjucntionNode
  | ImplicationNode;

/** Order tokens by Reverse Polish Notation, RPN */
export function orderByRPN(tokens: Token[]): Token[] {
  const stack = new Stack<Token>();
  const output: Token[] = [];

  for (const token of tokens) {
    switch (token.type) {
      case "right_parenthesis": {
        while (stack.top && stack.top.type !== "left_parenthesis") {
          const popped = stack.popForce();
          output.push(popped);
        }

        if (!stack.top) {
          // TODO: more detailed error message
          throw new Error("Left parenthesis not found");
        }

        if (stack.top.type === "left_parenthesis") {
          stack.popForce();
        } else {
          // never
          throw new Error("Unexpected top token");
        }
        break;
      }
      case "left_parenthesis": {
        stack.push(token);
        break;
      }
      case "negation": {
        // TODO:
        break;
      }
      // binary operator
      case "conjunction":
      case "disjunction":
      case "implication": {
        let top: UnknownToken | undefined = stack.top;
        while (
          (
            // top token is a binary operator
            top &&
            top.operator &&
            top.operator.type === "binary_operator"
          ) &&
          (
            // token is left associativity and priority is less than or equal to top
            token.operator.associativity === "left" &&
              token.operator.priority <= top.operator.priority ||
            // token's priority is less than top
            token.operator.priority < top.operator.priority
          )
        ) {
          const popped = stack.popForce();
          output.push(popped);

          // next top
          top = stack.top;
        }

        stack.push(token);
        break;
      }
      case "variable": {
        output.push(token);
        break;
      }
    }
  }

  const rest = stack.popAll();
  if (rest.find((token) => token.type === "left_parenthesis")) {
    // TODO: more detailed error message
    throw new Error("Unexpected left parenthesis");
  }

  return output.concat(rest);
}
