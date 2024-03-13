import { IFederatedEventTarget } from './FederatedEventTarget';

/**  @see: https://developer.mozilla.org/en-US/docs/Web/CSS/cursor */
export type Cursor =
  | 'auto'
  | 'default'
  | 'none'
  | 'context-menu'
  | 'help'
  | 'pointer'
  | 'progress'
  | 'wait'
  | 'cell'
  | 'crosshair'
  | 'text'
  | 'vertical-text'
  | 'alias'
  | 'copy'
  | 'move'
  | 'no-drop'
  | 'not-allowed'
  | 'e-resize'
  | 'n-resize'
  | 'ne-resize'
  | 'nw-resize'
  | 's-resize'
  | 'se-resize'
  | 'sw-resize'
  | 'w-resize'
  | 'ns-resize'
  | 'ew-resize'
  | 'nesw-resize'
  | 'col-resize'
  | 'nwse-resize'
  | 'row-resize'
  | 'all-scroll'
  | 'zoom-in'
  | 'zoom-out'
  | 'grab'
  | 'grabbing';

export type TrackingData = {
  pressTargetsByButton: {
    [id: number]: IFederatedEventTarget[];
  };
  clicksByButton: {
    [id: number]: {
      clickCount: number;
      target: IFederatedEventTarget;
      timeStamp: number;
    };
  };
  overTargets: IFederatedEventTarget[];
};

export type InteractivePointerEvent = PointerEvent | TouchEvent | MouseEvent | WheelEvent;

export interface FormattedPointerEvent extends PointerEvent {
  isPrimary: boolean;
  width: number;
  height: number;
  tiltX: number;
  tiltY: number;
  pointerType: string;
  pointerId: number;
  pressure: number;
  twist: number;
  tangentialPressure: number;
  isNormalized: boolean;
  type: string;
}

export interface FormattedTouch extends Touch {
  button: number;
  buttons: number;
  isPrimary: boolean;
  width: number;
  height: number;
  tiltX: number;
  tiltY: number;
  pointerType: string;
  pointerId: number;
  pressure: number;
  twist: number;
  tangentialPressure: number;
  layerY: number;
  offsetX: number;
  offsetY: number;
  isNormalized: boolean;
  type: string;
}
