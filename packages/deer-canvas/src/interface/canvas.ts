import { Group } from '..';
import { ShapeCtor, Vector2 } from '../util';
import { DisplayObject } from '../core/DisplayObject';
import { RenderingSystem, EventSystem, ContextSystem } from '../systems';
import { ICamera } from '../camera';
import { BaseStyleProps } from './displayObject';
import { EventEmitter } from 'eventtool';
import { CanvasGlobalEventMap } from '@/types';

export interface ICanvas {
  container: HTMLElement;
  root: Group;

  eventEmitter: EventEmitter<CanvasGlobalEventMap>;

  createElement: <T extends DisplayObject, StyleProps extends BaseStyleProps>(
    ctor: new (config: ShapeCtor<StyleProps>) => T,
    config: ShapeCtor<StyleProps>
  ) => T;

  /**
   * Transform point from canvas viewport space to world space.
   * @param viewport viewport point in canvas
   */
  viewport2Canvas: (viewport: Vector2) => Vector2;
  /**
   * Transform point from canvas world space to viewport space.
   * @param canvas world point in canvas
   */
  canvas2Viewport: (canvas: Vector2) => Vector2;
  /**
   * Transform point from canvas screen space to browser pos.
   * @param viewport viewport point in canvas
   */
  viewport2Client: (viewport: Vector2) => Vector2;
  /**
   * Transform point from browser pos to canvas screen space.
   * @param client client point in browser scope
   */
  client2Viewport: (client: Vector2) => Vector2;

  getEventSystem: () => EventSystem;
  getContextSystem: () => ContextSystem;

  getConfig: () => ResolvedCanvasConfig;

  getCamera: () => ICamera;
}

export interface CanvasContext {
  config: ResolvedCanvasConfig;
  camera: ICamera;

  renderingContext: RenderingContext;

  eventSystem: EventSystem;
  renderingSystem: RenderingSystem;
  contextSystem: ContextSystem;
}

export interface CanvasConfig {
  container: HTMLElement | string;
  canvasEl?: HTMLCanvasElement;
  width?: number;
  height?: number;

  devicePixelRatio?: number;

  supportsCSSTransform?: boolean;
  supportsPointerEvents?: boolean;
  supportsTouchEvents?: boolean;
}

export interface ResolvedCanvasConfig extends Required<CanvasConfig> {
  container: HTMLElement;
}

export interface RenderingContext {
  root: Group;
}
