import { Group } from '..';
import { Vector2 } from '../util';
import { DisplayObject } from '../DisplayObject';
import { RenderingSystem, EventSystem, ContextSystem } from '../systems';
import { ICamera } from '../camera';

export interface ICanvas {
  container: HTMLElement;
  root: Group;

  createElement: <T extends DisplayObject>(ctor: new (context: CanvasContext) => T) => T;

  /**
   * Transform point from canvas viewport space to screen space.
   * @param viewport viewport point in canvas
   */
  viewport2Canvas: (viewport: Vector2) => Vector2;
  /**
   * Transform point from canvas screen space to viewport space.
   * @param canvas screen point in canvas
   */
  canvas2Viewport: (canvas: Vector2) => Vector2;
  /**
   * Transform point from canvas screen spcace to browser pos.
   * @param viewport viewport point in canvas
   */
  viewport2Client: (viewport: Vector2) => Vector2;
  /**
   * Transform point from browser pos to canvas screen spcace.
   * @param client client point in browser scope
   */
  client2Viewport: (client: Vector2) => Vector2;

  getEventSystem: () => EventSystem;
}

export interface CanvasContext {
  config: Required<CanvasConfig>;
  camera: ICamera;

  renderingContext: RenderingContext;

  eventSystem: EventSystem;
  renderingSystem: RenderingSystem;
  contextSystem: ContextSystem;
}

export interface CanvasConfig {
  container: HTMLElement;
  canvasEl?: HTMLCanvasElement;
  width?: number;
  height?: number;

  devicePixelRatio?: number;

  supportsCSSTransform?: boolean;
  supportsPointerEvents?: boolean;
  supportsTouchEvents?: boolean;
}

export interface RenderingContext {
  root: Group;
  renderListCurrentFrame: DisplayObject[];
}
