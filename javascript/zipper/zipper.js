const lastIndex = list => list && list.length > 0 ? list.length - 1 : 0;

const isNone = val => val === null || typeof val === 'undefined';

const asList = list => isNone(list) ? [] : list;

const isEmptyList = list => list && list.length <= 0;

const isLastIndex = (lst, index) => (asList(lst).length - 1) === index;

const tail = list => isEmptyList(list) ? [] : list.slice(1);

const head = list => list[0] || null;

const cons = (head, list) => [head, ...asList(list)];

const append = (list, elem) => isNone(elem) ?
  list : [...asList(list), elem];

const dropLast = list => asList(list).slice(0, lastIndex(list));

const excludeRoot = paths => asList(paths).filter(path => path !== 'root');

const clone = obj => JSON.parse(JSON.stringify(obj));

const setPathValue = (obj, paths, newValue) => {
  const newObj = clone(obj);
  paths.reduce((val, key, index) => {
    if (isLastIndex(paths, index)) {
      val[key] = newValue;
      return val;
    }
    return val[key];
  }, newObj);
  return newObj;
};

const pathValue = (obj, paths) => paths.reduce(
  (val, key) => val[key], obj,
);

class Zipper {
  constructor(tree, paths = ['root']) {
    this.tree = tree;
    this.paths = paths;
  }

  _pushFocusNode(path) {
    const paths = append(this.paths, path);
    const nodeVal = pathValue(this.tree, excludeRoot(paths));
    if (isNone(nodeVal)) {
      return nodeVal;
    }
    return this.asZipper(paths);
  }

  up() {
    return this.asZipper(dropLast(this.paths));
  }

  left() {
    return this._pushFocusNode('left');
  }

  right() {
    return this._pushFocusNode('right');
  }

  value() {
    return pathValue(this.tree,
      excludeRoot(append(this.paths, 'value')),
    );
  }

  delete() {
    return setAttribute(this.tree, this.paths, undefined);
  }

  setValue(value) {
    return setAttribute(
      this.tree,
      append(this.paths, 'value'),
      value,
    );
  }

  setLeft(value) {
    return setAttribute(
      this.tree,
      append(this.paths, 'left'),
      value,
    );
  }

  setRight(value) {
    return setAttribute(
      this.tree,
      append(this.paths, 'right'),
      value,
    );
  }

  asZipper(paths) {
    return asZipper(this.tree, paths);
  }

  toTree() {
    return this.tree;
  }
}

const asZipper = (tree, paths) => {
  if (isEmptyList(paths)) {
    return null;
  }
  return new Zipper(tree, paths);
};

const setAttribute = (ctx, paths, value) => {
  const tree = setPathValue(ctx,
    excludeRoot(paths),
    value);
  return asZipper(tree, paths);
};

Zipper.fromTree = t => new Zipper(t);

export default Zipper;