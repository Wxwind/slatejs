import { EventEmitter } from '@/packages/eventEmitter';
import { FederatedEvent } from '.';
import { Cursor } from './types';
import { FederatedEventEmitterTypes, FederatedEventMap } from './FederatedEventMap';

type AddListenerOptions = boolean | AddEventListenerOptions;
type RemoveListenerOptions = boolean | EventListenerOptions;

interface EventListener {
  (evt: FederatedEvent): void;
}
interface EventListenerObject {
  handleEvent(object: FederatedEvent): void;
}

export type EventListenerOrEventListenerObject = EventListener | EventListenerObject;

export interface IFederatedEventTarget {
  readonly emitter: EventEmitter<FederatedEventEmitterTypes, [FederatedEvent]>;
  readonly parent: IFederatedEventTarget | undefined;
  cursor: Cursor;

  addEventListener<K extends keyof FederatedEventMap>(
    type: K,
    listener: (e: FederatedEventMap[K]) => void,
    options?: AddListenerOptions
  ): void;
  addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: AddListenerOptions): void;

  removeEventListener<K extends keyof FederatedEventMap>(
    type: K,
    listener: (e: FederatedEventMap[K]) => void,
    options?: RemoveListenerOptions
  ): void;
  removeEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: RemoveListenerOptions
  ): void;
}

export class FederatedEventTarget implements IFederatedEventTarget {
  parent: IFederatedEventTarget | undefined;
  cursor: Cursor = 'default';

  emitter = new EventEmitter<FederatedEventEmitterTypes, [FederatedEvent]>();

  addEventListener<K extends keyof FederatedEventMap>(
    type: K,
    listener: (e: FederatedEventMap[K]) => void,
    options?: AddListenerOptions
  ): void;
  addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: AddListenerOptions): void;

  addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: AddListenerOptions) {
    const capture = (typeof options === 'boolean' && options) || (typeof options === 'object' && options.capture);
    const signal = typeof options === 'object' ? options.signal : undefined;
    const once = typeof options === 'object' ? options.once === true : false;

    type = capture ? `${type}capture` : type;
    const listenerFn = typeof listener === 'function' ? listener : listener.handleEvent;

    if (signal) {
      signal.addEventListener('abort', () => {
        this.emitter.off(type, listenerFn);
      });
    }

    if (once) {
      this.emitter.once(type, listenerFn);
    } else {
      this.emitter.on(type, listenerFn);
    }
  }

  removeEventListener<K extends keyof FederatedEventMap>(
    type: K,
    listener: (e: FederatedEventMap[K]) => void,
    options?: RemoveListenerOptions
  ): void;
  removeEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: RemoveListenerOptions
  ): void;
  removeEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: RemoveListenerOptions) {
    const capture = (typeof options === 'boolean' && options) || (typeof options === 'object' && options.capture);

    type = capture ? `${type}capture` : type;
    listener = typeof listener === 'function' ? listener : listener.handleEvent;

    this.emitter.off(type, listener);
  }
}
