import { CanvasContext, IRenderingPlugin } from '@/interface';
import { throttle } from '@/util';

export class ResizePlugin implements IRenderingPlugin {
  name = 'ResizePlugin';

  apply(context: CanvasContext): void {
    const renderingSystem = context.renderingSystem;

    const resize = (width: number, height: number) => {
      const config = context.config;
      const contextSystem = context.contextSystem;
      config.width = width;
      config.height = height;
      contextSystem.resize(width, height);
    };

    const debouncedResize = throttle(resize, 50, {
      trailing: true,
    });

    renderingSystem.hooks.init.tap(() => {
      const resizeObserver = new ResizeObserver((entries) => {
        const { width, height } = entries[0].contentRect;
        debouncedResize(width, height);
      });
      const container = context.config.container;
      resizeObserver.observe(container);

      const dispose = () => {
        resizeObserver.unobserve(container);
      };

      renderingSystem.hooks.destory.tap(() => {
        dispose();
      });
    });
  }
}
