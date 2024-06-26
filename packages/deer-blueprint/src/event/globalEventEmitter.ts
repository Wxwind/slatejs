import { EventEmitter } from 'eventtool';
import { GlobalEventMap } from './globalEventMap';

export const globalEventEmitter = new EventEmitter<GlobalEventMap>();
