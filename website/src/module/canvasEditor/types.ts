export type EventName = 'click' | 'pointerdown' | 'pointermove' | 'pointerup' | 'pointerover';
export type Vector2 = {
  x: number;
  y: number;
};

export interface UIEvent {
  pos: Vector2;
  isStopCapturing: boolean;
}
