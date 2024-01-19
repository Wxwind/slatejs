import { Canvas } from 'canvaskit-wasm';
import { IDrawable } from './IDrawable';
import { EventName, Vector2, UIEvent } from './types';
import { EventEmitter } from '@/packages/eventEmitter';

export abstract class DrawableObject extends EventEmitter<EventName, [UIEvent]> implements IDrawable {
  abstract draw: (canvas: Canvas) => void;
  abstract isPointIn: (point: Vector2) => boolean;
}
