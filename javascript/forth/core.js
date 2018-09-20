// function library
const first = lst => lst[0];

const head = first;

const isEmpty = lst => lst.length <= 0;

const isNumber = n => typeof n !== 'undefined' && !isNaN(n);

const isString = s => s && typeof s === 'string';

const isFunction = fn => fn && typeof fn === 'function';

const last = seq => seq[seq.length - 1];

const pop = lst => {
  if (lst.length < 1) {
    throw new Error('Stack empty');
  }
  const lastIndex = lst.length - 1;
  return {
    head: lst[lastIndex],
    tail: lst.slice(0, lastIndex),
  };
};

const popTimes = (lst, n = 1) => {
  return range(n).reduce(
    a => {
      const tail = a.tail || lst;
      const result = pop(tail);
      a.heads.push(result.head);
      a.tail = result.tail;
      return a;
    },
    { heads: [] }
  );
};

const range = n => Array(n).fill().map(eval.call, Number);

const tail = ([head, ...tail]) => tail;

const toLower = s => (isString(s) ? s.toLowerCase() : s);

// logic helpers
const TERMINATORS = [':', ';'];

const isTerminatingWord = w => TERMINATORS.indexOf(w) >= 0;

const isAsseblyWord = w => toLower(w) === toLower(first(TERMINATORS));

const applyWord = (stack, fn) => {
  const { heads: args, tail } = popTimes(stack, fn.length);
  // no tail === no arguments, accept result and re-evaluate
  const rstack = tail || stack;
  const result = fn(...args);
  return [...rstack, ...result];
};

const assemble = ([name, ...stack]) => {
  if (isNumber(name)) {
    throw new Error('Invalid definition');
  }
  const bundle = assembleInstructions(stack);
  return { name, ...bundle };
};

const assemblyBinding = instructions => () => instructions;

const assembleInstructions =  (stack = [], acc = { instructions: [], stack: [] }) => {
  if (stack.length === 0) {
    return acc;
  }
  const word = head(stack);
  const queue = tail(stack);
  acc.stack = queue;
  if (isTerminatingWord(word)) {
    return acc;
  }
  acc.instructions.push(word);
  return assembleInstructions(queue, acc);
};

const bindWithDictionary = dictionary => (word, fn) => {
  dictionary[toLower(word)] = fn;
};

// TODO: include strings
const canApplyDictionaryWord = hasWord => word => hasWord(word) || !isNumber(word);

const evalStackWithDictionary = dictionary => {
  const bindWord = bindWithDictionary(dictionary);
  const canApplyWord = canApplyDictionaryWord(hasDictionaryWord(dictionary))
  const hasWord = hasDictionaryWord(dictionary);
  const findWordFn = findWordInDictionary(dictionary);
  // stack manipulation
  const assembleOrEval = (rstack = [], stack = []) => {
    if (rstack.length === 0) {
      return stack;
    }
    const word = head(rstack);
    const queue = tail(rstack);
    if (isAsseblyWord(word)) {
      const bundle = assemble(queue);
      const { name, instructions} = bundle;
      bindWord(name, assemblyBinding(instructions));
      return assembleOrEval(bundle.stack, stack);
    } else if (canApplyWord(word)) {
      if (!hasWord(word)) {
        throw new Error('Unknown command');
      }
      const fn = findWordFn(word);
      if (isFunction(fn)) {
        const rval = applyWord(stack, fn);
        const next = [...rval, ...queue];
        return assembleOrEval(next, []);
      }
    }
    return assembleOrEval(queue, [...stack, word]);
  };
  return assembleOrEval;
};

const findWordInDictionary = dictionary => w => dictionary[toLower(w)];

const hasDictionaryWord = dictionary => word =>
  Object.keys(dictionary)
    .map(toLower)
    .indexOf(toLower(word)) !== -1;

// core: word definitions
const add = (a, b) => [a + b];

const divide = (a, b) => {
  if (a === 0) {
    throw new Error('Division by zero')
  }
  return [Math.floor(b / a)];
};

const drop = a => [];

const dup = a => [a, a];

const multiply = (a, b) => [a * b];

const over = (a, b) => [b, a, b];

const subtract = (a, b) => [b - a];

const swap = (a, b) => [a, b];

const CORE_DICTIONARY = {
  '+': add,
  '*': multiply,
  '-': subtract,
  '/': divide,
  dup,
  drop,
  swap,
  over,
};

const api = { evalStack: evalStackWithDictionary, dictionary: CORE_DICTIONARY };
export default api;
