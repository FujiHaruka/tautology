import { Node, parseAST } from "./AST.ts";
import { tokenize } from "./tokenize.ts";

function getVariablesRecursively(node: Node): string[] {
  switch (node.nodeType) {
    case "variable_node":
      return [node.token.value];
    case "unary_operator_node":
      return getVariablesRecursively(node.target);
    case "binary_operator_node":
      return getVariablesRecursively(node.left).concat(
        getVariablesRecursively(node.right),
      );
  }
}

function estimateRecursively(
  node: Node,
  variableValues: Record<string, boolean>,
): boolean {
  switch (node.nodeType) {
    case "variable_node": {
      const value = variableValues[node.token.value];
      if (typeof value === "undefined") {
        throw new Error(`Value of variable "${node.token.value}" is not given`);
      }
      return value;
    }
    case "unary_operator_node": {
      const value = estimateRecursively(node.target, variableValues);
      switch (node.token.type) {
        case "negation":
          return !value;
        default:
          // never
          throw new Error("Unsupported operator");
      }
    }
    case "binary_operator_node": {
      const leftValue = estimateRecursively(node.left, variableValues);
      const rightValue = estimateRecursively(node.right, variableValues);
      switch (node.token.type) {
        case "conjunction":
          return leftValue && rightValue;
        case "disjunction":
          return leftValue || rightValue;
        case "implication":
          // NOT a OR b
          return !leftValue || rightValue;
        default:
          // never
          throw new Error("Unsupported operator");
      }
    }
  }
}

export class Formula {
  private constructor(
    private ast: Node,
  ) {}

  static parse(code: string): Formula {
    const tokens = tokenize(code);
    const ast = parseAST(tokens);
    return new Formula(ast);
  }

  get variables(): string[] {
    return getVariablesRecursively(this.ast);
  }

  estimate(variableValues: Record<string, boolean>): boolean {
    // TODO: should it throw error if unused variables exist?

    return estimateRecursively(this.ast, variableValues);
  }

  isTautology(): boolean {
    const { variables } = this;

    // All patterns of variable values
    // TODO: implement

    return true;
  }
}
