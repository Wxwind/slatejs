export namespace ReflectionTool {
  export const getValue = (object: Record<string, unknown>, propertyPath: string) => {
    if (propertyPath in object) {
      return object[propertyPath];
    }
  };

  export function setValue<T extends Record<string, unknown>, K extends keyof T>(
    object: T,
    propertyPath: K,
    value: T[K]
  ) {
    object[propertyPath] = value;
  }
}
