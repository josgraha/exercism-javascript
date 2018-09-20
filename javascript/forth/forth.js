import api from './core';

const TOKEN_REGEX = /".*?"|\S+/g;

const isNumber = num => !isNaN(num);

const toNumberOrToken = val => (isNumber(val) ? Number(val) : val);

const lex = tokenize => str =>
  typeof str === 'string' ? str.match(TOKEN_REGEX).map(tokenize) : [];

const stackify = lex(toNumberOrToken);

const { dictionary, evalStack } = api;
class Forth {
  constructor() {
    this.stack = [];
    this.dictionary = { ...dictionary };
    this.evalStack = evalStack(this.dictionary);
  }

  evaluate(code) {
    this.stack = this.evalStack(stackify(code));
  }
}

export default Forth;
