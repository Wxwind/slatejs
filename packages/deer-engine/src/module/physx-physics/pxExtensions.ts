import PhysX from 'physx-js-webidl';

type AnyCtor = new (...args: any[]) => any;

// FIXME: following mixins not work
declare module 'physx-js-webidl' {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  export namespace PhysX {
    export function wrapPointer<T extends AnyCtor>(ptr: number, __class__: T): InstanceType<T>;
  }
}

export function castPxObject<T extends AnyCtor>(
  px: typeof PhysX & typeof PhysX.PxTopLevelFunctions,
  pxObject: any,
  __class__: T
): InstanceType<T> {
  return (px as any).wrapPointer(pxObject.ptr, __class__);
}

export function castPxPointer<T extends AnyCtor>(
  px: typeof PhysX & typeof PhysX.PxTopLevelFunctions,
  pxPtr: any,
  __class__: T
): InstanceType<T> {
  return (px as any).wrapPointer(pxPtr, __class__);
}
