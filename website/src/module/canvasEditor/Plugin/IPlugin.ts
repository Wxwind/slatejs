import { CanvasContext } from '../types';

export interface RenderingPluginContext extends CanvasContext {}

export interface IPlugin {
  name: string;
  init(context: RenderingPluginContext): void;
  destroy(): void;
}
