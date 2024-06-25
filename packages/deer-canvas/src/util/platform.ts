/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { FederatedMouseEvent } from '@/events';

const getGlobalThis = () => {
  if (typeof self !== 'undefined') return self;
  if (typeof window !== 'undefined') return window;
  // @ts-ignore
  if (typeof global !== 'undefined') return global;
  return {};
};

export const runtimeGlobalThis: (
  | {
      requestAnimationFrame: (callback: FrameRequestCallback) => number;
      cancelAnimationFrame: (handle: number) => void;
      navigator: undefined;
      performance: undefined;
    }
  | (Window & typeof globalThis)
) &
  Record<string, any> = getGlobalThis() as any;

const userAgent = runtimeGlobalThis.navigator ? runtimeGlobalThis.navigator.userAgent.toLowerCase() : '';

export const isMac = userAgent.includes('mac');
export const isWin = userAgent.includes('win');

export const ctrlKeyStr = isMac ? '⌘' : 'Ctrl';
export const shiftKeyStr = isMac ? '⇧' : 'Shift';
export const deleteKeyStr = isMac ? 'Backspace' : 'Delete';

export const isCtrlKey = (e: KeyboardEvent | FederatedMouseEvent): boolean => (isMac ? e.metaKey : e.ctrlKey);
export const isDeleteKey = (e: KeyboardEvent): boolean => (isMac ? e.key === 'Backspace' : e.key === 'Delete');
export const isInputTag = (el: HTMLElement): boolean => el.tagName === 'INPUT' || el.tagName === 'TEXTAREA';

/**
 * https://gist.github.com/1866474
 * https://github.com/Financial-Times/polyfill-library/blob/master/polyfills/requestAnimationFrame/polyfill.js
 **/

let uId = 1;
const uniqueId = () => uId++;

const nowOffset = Date.now();

// use performance api if exist, otherwise use Date.now.
// Date.now polyfill required.
export const pnow = (): number => {
  if (runtimeGlobalThis.performance && typeof runtimeGlobalThis.performance.now === 'function') {
    return runtimeGlobalThis.performance.now();
  }

  // fallback
  return Date.now() - nowOffset;
};

interface IReservedCBs {
  [key: string]: (...args: any[]) => any;
}
let reservedCBs: IReservedCBs = {};

let lastTime = Date.now();

const polyfillRaf = (callback: (...args: any[]) => any) => {
  if (typeof callback !== 'function') {
    throw new TypeError(callback + ' is not a function');
  }

  const currentTime = Date.now();
  const gap = currentTime - lastTime;
  const delay = gap > 16 ? 0 : 16 - gap;

  const id = uniqueId();
  reservedCBs[id] = callback;

  // has callback existing
  if (Object.keys(reservedCBs).length > 1) return id;

  setTimeout(() => {
    lastTime = currentTime;
    const copied = reservedCBs;
    reservedCBs = {};

    Object.keys(copied).forEach((key: string) => copied[key](pnow()));
  }, delay);

  return id;
};

const polyfillCaf = (id: number) => {
  delete reservedCBs[id];
};

const vendorPrefixes = ['', 'webkit', 'moz', 'ms', 'o'];

type TRequestAnimationFrame = (callback: (...args: any[]) => any) => number;
type TCancelAnimationFrame = (id: number) => void;

const getRequestAnimationFrame = (vp: string | void): TRequestAnimationFrame => {
  if (typeof vp !== 'string') return polyfillRaf;
  if (vp === '') return runtimeGlobalThis['requestAnimationFrame'];
  return runtimeGlobalThis[vp + 'RequestAnimationFrame'];
};

const getCancelAnimationFrame = (vp: string | void): TCancelAnimationFrame => {
  if (typeof vp !== 'string') return polyfillCaf;
  if (vp === '') return runtimeGlobalThis['cancelAnimationFrame'];
  return runtimeGlobalThis[vp + 'CancelAnimationFrame'] || runtimeGlobalThis[vp + 'CancelRequestAnimationFrame'];
};

const find = (arr: any[], predicate: (...args: any[]) => any) => {
  let i = 0;
  while (arr[i] !== void 0) {
    if (predicate(arr[i])) return arr[i];

    i = i + 1;
  }
};

const vp = find(vendorPrefixes, (vp: string) => !!getRequestAnimationFrame(vp));

export const raf: TRequestAnimationFrame = getRequestAnimationFrame(vp);
export const caf: TCancelAnimationFrame = getCancelAnimationFrame(vp);

runtimeGlobalThis.requestAnimationFrame = raf.bind(runtimeGlobalThis);
runtimeGlobalThis.cancelAnimationFrame = caf.bind(runtimeGlobalThis);
