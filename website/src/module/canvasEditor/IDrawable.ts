import { Canvas } from 'canvaskit-wasm';

export interface IDrawable {
  draw: (canvas: Canvas) => void;
}
