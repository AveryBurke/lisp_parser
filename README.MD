# Lisp Parser

A minimal lisp parser that runs in a REPL.

## Dependencies

You will need [node](https://nodejs.org/en) installed.

## Usage

Start the REPL with `yarn start`. Then enter a lisp program and the REPL will return an abstract syntax tree, or a syntax error if your code is not syntactically correct `$ type some lisp> ((()) ()) \\ [ [ [] ], [] ]` `$ type some lisp> (12a) \\ "malformed number 12a"` 

exit the REPL with `Ctrl+C`
 
Run tests with `yarn test`.