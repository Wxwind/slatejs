import { DisplayObject } from '@/core';

export interface StyleRenderer {
  render: (object: DisplayObject, ctx: CanvasRenderingContext2D) => void;
}
