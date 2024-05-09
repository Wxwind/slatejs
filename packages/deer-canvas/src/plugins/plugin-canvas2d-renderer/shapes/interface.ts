import { DisplayObject } from '@/core';
import { CanvasContext } from '@/interface';

export interface StyleRenderer {
  render: (ctx: CanvasRenderingContext2D, object: DisplayObject, context: CanvasContext) => void;
}
