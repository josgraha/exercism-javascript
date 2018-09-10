const lastIndex = list => (
  list && list.length > 0 ? list.length - 1 : 0);

const isNone = val => val === null || typeof val === 'undefined';

const asList = list => (isNone(list) ? [] : list);

const isEmptyList = list => list && list.length <= 0;

const isLastIndex = (lst, index) => (asList(lst).length - 1) === index;

const append = (list, elem) => (isNone(elem) ?
  list : [...asList(list), elem]);

const dropLast = list => asList(list).slice(0, lastIndex(list));

const excludeRoot = paths => asList(paths).filter(path => path !== 'root');

const clone = obj => JSON.parse(JSON.stringify(obj));

const setPathValue = (obj, paths, newValue) => {
  const newObj = clone(obj);
  paths.reduce((val, key, index) => {
    if (isLastIndex(paths, index)) {
      const node = val;
      node[key] = newValue;
      return node;
    }
    return val[key];
  }, newObj);
  return newObj;
};

const pathValue = (obj, paths) => paths.reduce(
  (val, key) => val[key], obj
);

const createContainer = ContainerClass => (tree, paths) => {
  if (isEmptyList(paths)) {
    return null;
  }
  return new ContainerClass(tree, paths);
};

const createSetter = withContainer => (ctx, paths, value) => {
  const tree = setPathValue(ctx,
    excludeRoot(paths), value);
  return withContainer(tree, paths);
};

class Zipper {
  constructor(tree, paths = ['root']) {
    this.tree = tree;
    this.paths = paths;
  }

  pushFocusNode(path) {
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
    return this.pushFocusNode('left');
  }

  right() {
    return this.pushFocusNode('right');
  }

  value() {
    return pathValue(this.tree,
      excludeRoot(append(this.paths, 'value'))
    );
  }

  delete() {
    return Zipper.setAttribute(this.tree, this.paths, undefined);
  }

  setValue(value) {
    return Zipper.setAttribute(
      this.tree,
      append(this.paths, 'value'),
      value
    );
  }

  setLeft(value) {
    return Zipper.setAttribute(
      this.tree,
      append(this.paths, 'left'),
      value
    );
  }

  setRight(value) {
    return Zipper.setAttribute(
      this.tree,
      append(this.paths, 'right'),
      value
    );
  }

  asZipper(paths) {
    return Zipper.asZipper(this.tree, paths);
  }

  toTree() {
    return this.tree;
  }
}
Zipper.asZipper = createContainer(Zipper);
Zipper.setAttribute = createSetter(Zipper.asZipper);
Zipper.fromTree = t => new Zipper(t);

export default Zipper;
