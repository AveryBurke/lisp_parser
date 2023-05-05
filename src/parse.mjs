/**
 * @typedef {string | number } Token
 * @typedef {T[] | AST<T>[] | (T | AST<T>[])} AST<T>
 */

const endChars = " ()",
  numerals = "1234567890";

/**
 * checks the program for balanced Parentheses
 * @param {string} program
 * @returns {boolean} 
 */
const validateParentheses = (program) => {
  //if the first non-whitespace charcters are not matching paraens, throw and error
  let start = 0,
    end = program.length - 1;
  while (program[start] === " " && start < end) {
    start++;
  }
  while (program[end] === " " && end > start) { d
    end--;
  }

  if (program[start] !== "(" || program[end] !== ")")
    throw new Error("syntax error! a program must be enclosed in parentheses");

  let count = 0;
  for (let i = start + 1; i < end; i++) {
    if (count < 0) return false;
    const char = program[i];
    if (char === "(") count += 1;
    if (char === ")") count -= 1;
  }
  return count === 0;
};

/**
 * validates numerals.
 * If the result is a valid number, then the number and the current index are return.
 * If the result is not valid then the function throws an error
 * @param {string} program
 * @param {number} index
 * @returns {[number, number]}
 */
const validateNumber = (program, index) => {
  let num = program[index];
  let decimals = 0;
  index++;
  while (/\d|\./.test(program[index])) {
    num += program[index];
    if (program[index] === ".") decimals += 1;
    index++;
  }
  const number = Number(num); //<-- I don't know why something like Number(12.2.2) doesn't result in NAN
  if (number === NaN || decimals > 1 || !endChars.includes(program[index]))
    throw new Error(`malformed number ${num + program[index]}`.trim());
  return [number, index];
};

/**
 * validates symbols.
 * if the symbol is valid, then the lexeme and the current index are returned.
 * @param {string} program
 * @param {number} index
 * @returns {[string, number]}
 */
const validateSymbol = (program, index) => {
  let symb = "";
  while (!endChars.includes(program[index])) {
    symb += program[index];
    index++;
  }
  //no need to check if this token is outside parentheses or if this is the last token, because validateParentheses is run first
  return [symb, index];
};
/**
 * does what it says on the tin.
 * parses a string into tokens and validates the syntax.
 * @param {string} program
 * @returns {Token[]}
 */
const tokenizeAndValidate = (program) => {
  const tokens = [];
  let i = 0;
  if (!validateParentheses(program))
    throw new Error("syntax error! parentheses are not balanced");
  while (i < program.length) {
    const char = program[i];
    if (char) {
      switch (char) {
        case ")":
        case "(":
          {
            tokens.push(char);
            i++;
          }
          break;
        case "-":
          {
            if (numerals.includes(program[i + 1])) {
              const [number, index] = validateNumber(program, i);
              tokens.push(number);
              i = index;
              break;
            }
            tokens.push(char);
            i++;
          }
          break;
        case char.match(/\d/)?.input:
          {
            const [number, index] = validateNumber(program, i);
            tokens.push(number);
            i = index;
          }
          break;
        case char.match(/[a-z]/)?.input:
          {
            const [symb, index] = validateSymbol(program, i);
            i = index;
            tokens.push(symb);
          }
          break;
        case " ":
          {
            i++;
          }
          break;
        default:
          {
            tokens.push(char);
            i++;
          }
          break;
      }
    }
  }
  return tokens;
};
/**
 * makes an abstract sytax tree from an array of tokens
 * ex: ["(", "first", "(", "list", 1, "(", "+", 2, 3, ")", 9, ")", ")"] => ["first", ["list", 1, ["+", 2, 3], 9]]
 * @param {Token[]} tokens
 * @returns {AST<Token>}
 */
const makeAst = (tokens) => {
  /**
   * @param {Token[]} tokens
   * @param {number} index
   * @param {AST<Token>} node
   * @returns {[AST<Token>, number]}
   */
  const iterate = (tokens, index, node) => {
    if (index === tokens.length) return [node, 0];
    const token = tokens[index];
    switch (token) {
      case ")":
        return [node, index];
      case "(":
        const [child, childIndex] = iterate(tokens, index + 1, []);
        const [siblings, siblingIndex] = iterate(tokens, childIndex + 1, []);
        return [[...node, child, ...siblings], siblingIndex];
      default:
        return iterate(tokens, index + 1, [...node, token]);
    }
  };
  //start the processes off with an empty ast node and a list of tokens without the first '('
  return iterate(tokens, 1, [])[0];
};

//to do
/**
 * @param {AST<Token>} ast
 * @param {any} envornment should envornment be a hash table?
 * @returns {string | number} should this function return an expression?
 */
const interpret = (ast, envornment) => {};

/**
 *
 * @param {string} program
 * @returns {AST<Token>}
 */
const parse = (program) => {
  const ast = makeAst(tokenizeAndValidate(program));
  //to do
  // const result = interpret(ast, {})
  return ast;
};

export default { parse, tokenizeAndValidate };
