/**
 * manage CanvasKit, Canvas2D, CanvaElement, ContainerElement
 */
export interface ContextSystem<Context = unknown> {
  init?: () => void;
  initAsync?: () => Promise<void>;
  dispose: () => void;

  resize: (width: number, height: number) => void;
  getContext: () => Context;
  getCanvasElement: () => HTMLCanvasElement;
}
