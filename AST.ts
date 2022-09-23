import {
  BinaryOperatorToken,
  isBinaryOperatorToken,
  isUnaryOperatorToken,
  isVariableToken,
  Token,
  UnaryOperatorToken,
  UnknownToken,
  VariableToken,
} from "./tokenize.ts";
import { Stack } from "./utils.ts";

export type NodeType =
  | "variable"
  | "unary_operator"
  | "binary_operator";

export interface VariableNode {
  nodeType: "variable";
  token: VariableToken;
}
export interface UnaryOperatorNode {
  nodeType: "unary_operator";
  target: Node;
  token: UnaryOperatorToken;
}
export interface BinaryOperatorNode {
  nodeType: "binary_operator";
  left: Node;
  right: Node;
  token: BinaryOperatorToken;
}

export type Node =
  | VariableNode
  | UnaryOperatorNode
  | BinaryOperatorNode;

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
        stack.push(token);
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
            ) ||
          (
            // top token is an unary operator, which is high prioritized
            top &&
            top.operator &&
            top.operator.type === "unary_operator"
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

export function parseAST(tokens: Token[]): Node {
  const orderedTokens = orderByRPN(tokens);
  const stack = new Stack<Node>();

  for (const token of orderedTokens) {
    if (isVariableToken(token)) {
      stack.push({ nodeType: "variable", token });
    } else if (isUnaryOperatorToken(token)) {
      const target = stack.popForce();
      const node: UnaryOperatorNode = {
        nodeType: "unary_operator",
        token,
        target,
      };
      stack.push(node);
    } else if (isBinaryOperatorToken(token)) {
      const right = stack.popForce();
      const left = stack.popForce();
      const node: BinaryOperatorNode = {
        nodeType: "binary_operator",
        token,
        left,
        right,
      };
      stack.push(node);
    } else {
      // never
      throw new Error("Unexpected token");
    }
  }

  return stack.popForce();
}
