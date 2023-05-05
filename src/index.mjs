import parser from "./parse.mjs";
import repl from "repl";

const {parse} = parser

repl.start({
  prompt: "type some lisp > ",
  eval: function(cmd, context, filename, callback) {
    callback(null,  parse(cmd.replace(/(\n|\r)+$/, ''))) ;
  }
});