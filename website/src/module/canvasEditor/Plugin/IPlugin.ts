interface RenderingPluginContext {}

export interface IPlugin {
  name: string;
  init(context: RenderingPluginContext): void;
  destroy(): void;
}
