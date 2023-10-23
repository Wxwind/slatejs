export const deepClone = <T>(v: T) => {
  return JSON.parse(JSON.stringify(v)) as T;
};
