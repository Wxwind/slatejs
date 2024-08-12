/* eslint-disable @typescript-eslint/no-explicit-any */
type Fn = (...args: any[]) => any;

export type DebounceOptions = Partial<{
  leading: boolean;
  trailing: boolean;
  maxWait: number;
}>;

export function debounce<T extends Fn>(func: T, wait: number, options?: Partial<DebounceOptions>) {
  let result: ReturnType<T> | undefined;
  let timerId: number | undefined;
  let lastCallTime: number | undefined;
  let lastInvokeTime = 0;
  let leading = false;
  let trailing = true;
  let lastArgs: Parameters<T> | undefined;

  wait = +wait || 0;
  leading = !!options?.leading;
  const maxWait = options?.maxWait !== undefined ? Math.max(+options.maxWait || 0, wait) : undefined;
  trailing = !!options?.trailing;

  const invokeFunc = (time: number) => {
    const args = lastArgs;
    lastArgs = undefined;
    lastInvokeTime = time;
    result = func(...(args as Parameters<T>));
    return result;
  };

  const startTimer = (pendingFunc: Fn, milliseconds: number) => {
    return window.setTimeout(pendingFunc, milliseconds);
  };

  const cancelTimer = (id: number) => {
    window.clearTimeout(id);
  };

  const leadingEdge = (time: number) => {
    // Reset any `maxWait` timer.
    lastInvokeTime = time;
    // Start the timer for the trailing edge.
    timerId = startTimer(timerExpired, wait);
    // Invoke the leading edge.
    return leading ? invokeFunc(time) : result;
  };

  const remainingWait = (time: number) => {
    if (lastCallTime === undefined) return 0;
    const timeSinceLastCall = time - lastCallTime;
    const timeSinceLastInvoke = time - lastInvokeTime;
    const timeWaiting = wait - timeSinceLastCall;

    return maxWait !== undefined ? Math.min(timeWaiting, maxWait - timeSinceLastInvoke) : timeWaiting;
  };

  const shouldInvoke = (time: number) => {
    if (lastCallTime === undefined) return true;
    const timeSinceLastCall = time - lastCallTime;
    const timeSinceLastInvoke = time - lastInvokeTime;

    // Either this is the first call, activity has stopped and we're at the
    // trailing edge, the system time has gone backwards and we're treating
    // it as the trailing edge, or we've hit the `maxWait` limit.
    return (
      timeSinceLastCall >= wait || timeSinceLastCall < 0 || (maxWait !== undefined && timeSinceLastInvoke >= maxWait)
    );
  };

  const timerExpired = () => {
    const time = Date.now();
    if (shouldInvoke(time)) {
      return trailingEdge(time);
    }
    // Restart the timer.
    timerId = startTimer(timerExpired, remainingWait(time));
    return undefined;
  };

  const trailingEdge = (time: number) => {
    timerId = undefined;

    // Only invoke if we have `lastArgs` which means `func` has been
    // debounced at least once.
    if (trailing && lastArgs) {
      return invokeFunc(time);
    }
    lastArgs = undefined;
    return result;
  };

  const cancel = () => {
    if (timerId !== undefined) {
      cancelTimer(timerId);
    }
    lastInvokeTime = 0;
    lastArgs = lastCallTime = timerId = undefined;
  };

  const flush = () => {
    return timerId === undefined ? result : trailingEdge(Date.now());
  };

  const pending = () => {
    return timerId !== undefined;
  };

  const debounced = (...args: Parameters<T>) => {
    const time = Date.now();
    const isInvoking = shouldInvoke(time);

    lastArgs = args;
    lastCallTime = time;

    if (isInvoking) {
      if (timerId === undefined) {
        return leadingEdge(lastCallTime);
      }
      if (maxWait !== undefined) {
        // Handle invocations in a tight loop.
        timerId = startTimer(timerExpired, wait);
        return invokeFunc(lastCallTime);
      }
    }
    if (timerId === undefined) {
      timerId = startTimer(timerExpired, wait);
    }
    return result;
  };
  debounced.cancel = cancel;
  debounced.flush = flush;
  debounced.pending = pending;
  return debounced;
}
