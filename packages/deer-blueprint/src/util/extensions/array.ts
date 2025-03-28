export const pushUnique = <T>(array: T[], expand: T[]) => {
  for (let i = 0; i < expand.length; i++) {
    const ele = expand[i];
    if (array.indexOf(ele) == -1) {
      array.push(ele);
    }
  }
};

export const groupBy: <T>(array: T[], getKey: (el: T) => string) => Record<string, T[]> = (array, getKey) => {
  const res: Record<string, any[]> = {};
  array.forEach((a) => (res[getKey(a)] || (res[getKey(a)] = [] as unknown[])).push(a));
  return res;
};
