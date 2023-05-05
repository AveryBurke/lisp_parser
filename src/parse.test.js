import parser from "./parse.mjs";

const { tokenizeAndValidate, parse } = parser;

test("expect white space not to matter", () => {
  expect(tokenizeAndValidate("  (   1     b -18 c    )")).toEqual([
    "(",
    1,
    "b",
    -18,
    "c",
    ")",
  ]);
});

test("expect identifiers wtih special charaters, just like in real scheme", () => {
  expect(tokenizeAndValidate("(prime? is-good-no? prime_time)")).toEqual([
    "(",
    "prime?",
    "is-good-no?",
    "prime_time",
    ")",
  ]);
});

test("expect tokens for every arithmatic operator", () => {
  expect(tokenizeAndValidate("(* + - /)")).toEqual(['(', '*', "+", "-", "/", ')'])
})

test("expect an empty arrays", () => {
  expect(parse("()")).toEqual([]);
});

test("expect nested empty arrays", () => {
  expect(parse("( ( () ) () )")).toEqual([[[]], []]);
});

test("expect mixing numbers and letters throws an error", () => {
  expect(() => {
    parse("(12a)");
  }).toThrow("malformed number 12a");
});

test("expect an empty string to throw an error ", () => {
  expect(() => parse("")).toThrow(
    "syntax error! a program must be enclosed in parentheses"
  );
})

test("expect integers and floats", () => {
  expect(parse("(1 -2 100.00 -2.001)")).toEqual([1, -2, 100.0, -2.001]);
});

test("expect parser to reprdouce the example on the RC website", () => {
  expect(parse("(first (list 1 + (2 3) 9))")).toEqual([
    "first",
    ["list", 1, "+", [2, 3], 9],
  ]);
});

test("expect using too many decimals to throw an error", () => {
  expect(() => {
    parse("(a b 12.2.2 c)");
  }).toThrow("malformed number 12.2.2");
});

test("expect balanced paraenthisis without enclosing paraens to throw an error", () => {
  expect(() => parse("()()")).toThrow(
    "syntax error! parentheses are not balanced"
  );
})

test("expect missing paraenthisis error", () => {
  expect(() => parse("((())")).toThrow(
    "syntax error! parentheses are not balanced"
  );
});

test("expect no enclosing paraenthisis error", () => {
  expect(() => parse("a b (c) d")).toThrow(
    "syntax error! a program must be enclosed in parentheses"
  );
});

