// TODO: will be rewrite once ts decorator proposal is passed offcially.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(Symbol as any).metadata = Symbol();

export * from './core';
export * from './store';
export * from './config';
