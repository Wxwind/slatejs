import { CanvasContext } from './canvas';

/**
 * IRenderingPlugin will hook to RenderingSystem.hooks.
 */
export interface IRenderingPlugin {
  apply(context: CanvasContext): void;
}
