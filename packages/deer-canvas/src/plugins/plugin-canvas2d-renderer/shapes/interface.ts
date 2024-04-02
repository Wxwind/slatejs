import { DisplayObject } from '@/core';

export interface StyleRenderer {
  render: (ctx: CanvasRenderingContext2D, object: DisplayObject) => void;
}
