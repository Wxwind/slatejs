import { DisplayObject } from './core';
import { FederatedPointerEvent } from './events';
import { Keyframe } from 'deer-engine';

export enum Shape {
  Group = 'group',
  Circle = 'circle',
  Curve = 'curve',
  Line = 'line',
}

export enum ContextMenuType {
  Handle,
}

export type CanvasGlobalEventMap = {
  DisplayObjectContextMenu: (e: FederatedPointerEvent, object: Keyframe, type: ContextMenuType) => void;
};

export type CanvasGlobalEvent = keyof CanvasGlobalEventMap;
