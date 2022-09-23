# tautology

Parser of propositional logic formula. It enables to check if a given formula is tautology or not.

```ts
import { parse } from "./mod.ts";

const formula = parse("((a -> b) -> (NOT a OR b)) AND ((NOT a OR b) -> (a -> b))");

assert.equal(
  formula.estimate({
    a: true,
    b: false,
  }),
  true,
);

assert.equal(
  isTautology(formula),
  true,
);
```
