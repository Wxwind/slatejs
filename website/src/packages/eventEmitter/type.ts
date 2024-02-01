export type ValidEventTypes = string | symbol | object;
export type EventNames<T extends ValidEventTypes> = T extends string | symbol ? T : keyof T;

export type ArgumentMap<T extends object> = {
  [K in keyof T]: T[K] extends (...args: any[]) => void ? Parameters<T[K]> : T[K] extends any[] ? T[K] : any[];
};

export type EventListener<T extends ValidEventTypes, K extends EventNames<T>, L extends unknown[]> = T extends
  | string
  | symbol
  ? (...args: L) => void
  : (...args: ArgumentMap<Exclude<T, string | symbol>>[Extract<K, keyof T>]) => void;

export type EventArgs<T extends ValidEventTypes, K extends EventNames<T>, L extends unknown[]> = Parameters<
  EventListener<T, K, L>
>;
