interface TokenBase {
  startAt: number;
  endAt: number;
}

export interface VariableToken extends TokenBase {
  type: "variable";
  value: string;
}

export interface NegationToken extends TokenBase {
  type: "negation";
}

export interface ConjunctionToken extends TokenBase {
  type: "conjunction";
}

export interface DisjunctionToken extends TokenBase {
  type: "disjunction";
}

export interface ImplicationToken extends TokenBase {
  type: "implication";
}

export interface LeftParenthesisToken extends TokenBase {
  type: "left_parenthesis";
}

export interface RightParenthesisToken extends TokenBase {
  type: "right_parenthesis";
}

export type Token =
  | VariableToken
  | NegationToken
  | ConjunctionToken
  | DisjunctionToken
  | ImplicationToken
  | LeftParenthesisToken
  | RightParenthesisToken;

const HeadChars = {
  SPACE: " ",
  AND: "A",
  OR: "O",
  NOT: "N",
  IMPLY: "-",
  LEFT_PARENTHESIS: "(",
  RIGHT_PARENTHESIS: ")",
};
const TokenLengths = {
  AND: 3,
  OR: 2,
  NOT: 3,
  IMPLY: 2,
  LEFT_PARENTHESIS: 1,
  RIGHT_PARENTHESIS: 1,
};

class UnexpectedTokenError extends Error {
  constructor({ cursor }: { cursor: number }) {
    super(`Unexpected token at ${cursor}`);
  }
}

export function variableToken(cursor: number, value: string): VariableToken {
  return {
    type: "variable",
    value,
    startAt: cursor,
    endAt: cursor + value.length,
  };
}
export function negationToken(cursor: number): NegationToken {
  return {
    type: "negation",
    startAt: cursor,
    endAt: cursor + TokenLengths.NOT,
  };
}
export function conjunctionToken(cursor: number): ConjunctionToken {
  return {
    type: "conjunction",
    startAt: cursor,
    endAt: cursor + TokenLengths.AND,
  };
}
export function disjunctionToken(cursor: number): DisjunctionToken {
  return {
    type: "disjunction",
    startAt: cursor,
    endAt: cursor + TokenLengths.OR,
  };
}
export function implicationToken(cursor: number): ImplicationToken {
  return {
    type: "implication",
    startAt: cursor,
    endAt: cursor + TokenLengths.IMPLY,
  };
}
export function leftParenthesisToken(cursor: number): LeftParenthesisToken {
  return {
    type: "left_parenthesis",
    startAt: cursor,
    endAt: cursor + TokenLengths.LEFT_PARENTHESIS,
  };
}
export function rightParenthesisToken(cursor: number): RightParenthesisToken {
  return {
    type: "right_parenthesis",
    startAt: cursor,
    endAt: cursor + TokenLengths.RIGHT_PARENTHESIS,
  };
}

function isLowerCase(str: string): boolean {
  return /^[a-z]$/.test(str);
}

export function tokenize(code: string): Token[] {
  let cursor = 0;
  const tokens: Token[] = [];

  while (cursor < code.length) {
    const char = code.charAt(cursor);
    switch (char) {
      case HeadChars.SPACE:
        cursor++;
        break;
      case HeadChars.LEFT_PARENTHESIS:
        tokens.push(leftParenthesisToken(cursor));
        cursor += TokenLengths.LEFT_PARENTHESIS;
        break;
      case HeadChars.RIGHT_PARENTHESIS:
        tokens.push(rightParenthesisToken(cursor));
        cursor += TokenLengths.RIGHT_PARENTHESIS;
        break;
      case HeadChars.NOT:
        if (code.slice(cursor, cursor + 4) === "NOT ") {
          tokens.push(negationToken(cursor));
          cursor += TokenLengths.NOT;
        } else {
          throw new UnexpectedTokenError({ cursor });
        }
        break;
      case HeadChars.AND:
        if (code.slice(cursor, cursor + 4) === "AND ") {
          tokens.push(conjunctionToken(cursor));
          cursor += TokenLengths.AND;
        } else {
          throw new UnexpectedTokenError({ cursor });
        }
        break;
      case HeadChars.OR:
        if (code.slice(cursor, cursor + 3) === "OR ") {
          tokens.push(disjunctionToken(cursor));
          cursor += TokenLengths.OR;
        } else {
          throw new UnexpectedTokenError({ cursor });
        }
        break;
      case HeadChars.IMPLY:
        if (code.slice(cursor, cursor + 3) === "-> ") {
          tokens.push(implicationToken(cursor));
          cursor += TokenLengths.IMPLY;
        } else {
          throw new UnexpectedTokenError({ cursor });
        }
        break;
      default:
        if (isLowerCase(char)) {
          // Easy logic but bad performance
          // FIXME: handle edge cases like "aaaAND"
          const match = code.slice(cursor).match(/^[a-z]+/);
          if (match) {
            const value = match[0];
            tokens.push(variableToken(cursor, value));
            cursor += value.length;
          } else {
            throw new UnexpectedTokenError({ cursor });
          }
        } else {
          throw new UnexpectedTokenError({ cursor });
        }
    }
  }

  return tokens;
}
