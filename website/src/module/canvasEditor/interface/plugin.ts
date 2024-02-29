import { CanvasContext } from './canvas';

export interface RenderingPluginContext extends CanvasContext {}

export interface IPlugin {
  name: string;
  init(context: RenderingPluginContext): void;
  destroy(): void;
}
