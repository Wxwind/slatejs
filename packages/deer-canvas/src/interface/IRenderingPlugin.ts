import { CanvasContext } from './canvas';

/**
 * IRenderingPlugin will hook to RenderingSystem.hooks.
 */
export interface IRenderingPlugin {
  name: string;
  apply(context: CanvasContext): void;
}
