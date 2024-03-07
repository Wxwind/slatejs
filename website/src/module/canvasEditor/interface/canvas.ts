import { Group } from '..';
import { Vector2 } from '../util';
import { DisplayObject } from '../DisplayObject';
import { RenderingSystem, EventSystem, ContextSystem } from '../systems';

export interface ICanvas {
  container: HTMLElement;
  root: Group;

  createElement: <T extends DisplayObject>(ctor: new (context: CanvasContext) => T) => T;

  viewport2Canvas: (point: Vector2) => Vector2;

  getEventSystem: () => EventSystem;
}

export interface CanvasContext {
  config: Required<CanvasConfig>;

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
