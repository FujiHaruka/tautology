export interface BinaryOperator {
  type: "binary_operator";
  associativity: "left" | "right";
  priority: number;
}

export interface UnaryOperator {
  type: "unary_operator";
  priority: number;
}

export type TokenType =
  | "variable"
  | "negation"
  | "conjunction"
  | "disjunction"
  | "implication"
  | "left_parenthesis"
  | "right_parenthesis";

export interface TokenRange {
  startAt: number;
  endAt: number;
}

export interface VariableToken {
  type: "variable";
  value: string;
  range: TokenRange;
}
export interface ParenthesisToken {
  type: "left_parenthesis" | "right_parenthesis";
  value: string;
  range: TokenRange;
}
export interface UnaryOperatorToken {
  type: "negation";
  value: string;
  operator: UnaryOperator;
  range: TokenRange;
}
export interface BinaryOperatorToken {
  type: "conjunction" | "disjunction" | "implication";
  value: string;
  operator: BinaryOperator;
  range: TokenRange;
}

export type Token =
  | VariableToken
  | ParenthesisToken
  | UnaryOperatorToken
  | BinaryOperatorToken;

export interface UnknownToken {
  type: TokenType;
  value: string;
  operator?: UnaryOperator | BinaryOperator;
  range: TokenRange;
}

const Tokens = {
  variable: {
    type: "variable",
  },
  negation: {
    type: "negation",
    value: "NOT",
    operator: {
      type: "unary_operator",
      priority: 3,
    },
  },
  conjunction: {
    type: "conjunction",
    value: "AND",
    operator: {
      type: "binary_operator",
      associativity: "left",
      priority: 2,
    },
  },
  disjunction: {
    type: "disjunction",
    value: "OR",
    operator: {
      type: "binary_operator",
      associativity: "left",
      priority: 2,
    },
  },
  implication: {
    type: "implication",
    value: "->",
    operator: {
      type: "binary_operator",
      associativity: "right",
      priority: 1,
    },
  },
  left_parenthesis: {
    type: "left_parenthesis",
    value: "(",
  },
  right_parenthesis: {
    type: "right_parenthesis",
    value: ")",
  },
} as const;

const HeadChars = {
  SPACE: " ",
  AND: "A",
  OR: "O",
  NOT: "N",
  IMPLY: "-",
  LEFT_PARENTHESIS: "(",
  RIGHT_PARENTHESIS: ")",
};

class UnexpectedTokenError extends Error {
  constructor({ cursor }: { cursor: number }) {
    super(`Unexpected token at ${cursor}`);
  }
}

export function token(
  type: "variable",
  cursor: number,
  value: string,
): VariableToken;
export function token(
  type: Exclude<TokenType, "variable">,
  cursor: number,
): UnaryOperatorToken | BinaryOperatorToken | ParenthesisToken;
export function token(
  type: TokenType,
  cursor: number,
  variableValue?: string,
): Token {
  const base = Tokens[type];
  const value = base.type === "variable" ? variableValue! : base.value;
  return {
    ...Tokens[type],
    value,
    range: {
      startAt: cursor,
      endAt: cursor + value.length,
    },
  };
}

export function tokenize(code: string): Token[] {
  let cursor = 0;
  const tokens: Token[] = [];

  while (cursor < code.length) {
    const char = code.charAt(cursor);

    let currentToken: Token;
    switch (char) {
      case HeadChars.SPACE:
        cursor++;
        continue;
      case HeadChars.LEFT_PARENTHESIS:
        currentToken = token("left_parenthesis", cursor);
        break;
      case HeadChars.RIGHT_PARENTHESIS:
        currentToken = token("right_parenthesis", cursor);
        break;
      case HeadChars.NOT:
        if (code.slice(cursor, cursor + 4) === Tokens.negation.value + " ") {
          currentToken = token("negation", cursor);
        } else {
          throw new UnexpectedTokenError({ cursor });
        }
        break;
      case HeadChars.AND:
        if (code.slice(cursor, cursor + 4) === Tokens.conjunction.value + " ") {
          currentToken = token("conjunction", cursor);
        } else {
          throw new UnexpectedTokenError({ cursor });
        }
        break;
      case HeadChars.OR:
        if (code.slice(cursor, cursor + 3) === Tokens.disjunction.value + " ") {
          currentToken = token("disjunction", cursor);
        } else {
          throw new UnexpectedTokenError({ cursor });
        }
        break;
      case HeadChars.IMPLY:
        if (code.slice(cursor, cursor + 3) === Tokens.implication.value + " ") {
          currentToken = token("implication", cursor);
        } else {
          throw new UnexpectedTokenError({ cursor });
        }
        break;
      default:
        if (/^[a-z]$/.test(char)) {
          // Easy logic but bad performance
          // FIXME: handle edge cases like "aaaAND"
          const match = code.slice(cursor).match(/^[a-z]+/);
          if (match) {
            const value = match[0];
            currentToken = token("variable", cursor, value);
          } else {
            throw new UnexpectedTokenError({ cursor });
          }
        } else {
          throw new UnexpectedTokenError({ cursor });
        }
    }

    tokens.push(currentToken);
    cursor += currentToken.value.length;
  }

  return tokens;
}

// --- utilities ---

export function isVariableToken(token: UnknownToken): token is VariableToken {
  return token.type === "variable";
}
export function isUnaryOperatorToken(
  token: UnknownToken,
): token is UnaryOperatorToken {
  return token.operator?.type === "unary_operator";
}
export function isBinaryOperatorToken(
  token: UnknownToken,
): token is BinaryOperatorToken {
  return token.operator?.type === "binary_operator";
}

// --- test utilities ---
export type TokenValue = "NOT" | "AND" | "OR" | "->" | "(" | ")";
/** Create variable token */
export function v(value: string, cursor = NaN): VariableToken {
  return token("variable", cursor, value);
}
/** Create token by alias */
export function t(value: "NOT", cursor?: number): UnaryOperatorToken;
export function t(
  value: "OR" | "AND" | "->",
  cursor?: number,
): BinaryOperatorToken;
export function t(value: "(" | ")", cursor?: number): ParenthesisToken;
export function t(
  value: TokenValue,
  cursor?: number,
): UnaryOperatorToken | BinaryOperatorToken | ParenthesisToken;
export function t(
  value: TokenValue,
  cursor = NaN,
): UnaryOperatorToken | BinaryOperatorToken | ParenthesisToken {
  const base = Object.values(Tokens).find((token) =>
    (token as { value: string }).value === value
  );
  if (!base) {
    throw new Error(`Unexpected value: "${value}"`);
  }
  const type = base.type as Exclude<TokenType, "variable">;
  return token(type, cursor);
}
