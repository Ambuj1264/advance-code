export const updateChildrenAgesValue = (children: number[], value: number, index: number) =>
  children.map((childValue: number, i) => (i === index ? value : childValue));

export const changeChildrenAgesLength = (children: number[], numberOfChildren: number) => {
  if (children.length > numberOfChildren) {
    return children.slice(0, -1);
  }
  if (children.length < numberOfChildren) {
    return children.concat(9);
  }
  return children;
};
