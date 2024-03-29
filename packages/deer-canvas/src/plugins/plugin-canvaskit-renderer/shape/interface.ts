import { DisplayObject } from '@/core';
import { Canvas, CanvasKit } from 'canvaskit-wasm';

export interface StyleRenderer {
  render: (object: DisplayObject, CanvasKit: CanvasKit, canvas: Canvas) => void;
}
