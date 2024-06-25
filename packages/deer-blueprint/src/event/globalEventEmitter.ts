import { EventEmitter } from 'eventtool';
import { GlobalEventMap } from './globalEventMap';

export const GlobalEventEmitter = new EventEmitter<GlobalEventMap>();
