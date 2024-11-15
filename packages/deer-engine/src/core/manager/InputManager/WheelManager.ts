import { DeerEngine } from '@/core';
import { IInput } from './interface/IInput';
import { IVector3 } from '@/type';

export class WheelManager implements IInput {
  _delta: IVector3 = { x: 0, y: 0, z: 0 };

  private _nativeEvents: WheelEvent[] = [];

  constructor(
    private _engine: DeerEngine,
    private _target: HTMLElement
  ) {
    this.onWheelEvent = this.onWheelEvent.bind(this);
    this.addEventListener();
  }

  _update(): void {
    this._delta = { x: 0, y: 0, z: 0 };
    const { _delta, _nativeEvents } = this;
    if (_nativeEvents.length > 0) {
      for (const e of _nativeEvents) {
        _delta.x += e.deltaX;
        _delta.y += e.deltaY;
        _delta.z += e.deltaZ;
      }
      _nativeEvents.length = 0;
    }
  }

  _destroy(): void {
    this.removeEventListener();
  }

  private onWheelEvent(evt: WheelEvent) {
    this._nativeEvents.push(evt);
  }

  private addEventListener() {
    const target = this._target;
    target.addEventListener('wheel', this.onWheelEvent);
  }

  private removeEventListener() {
    const target = this._target;
    target.removeEventListener('wheel', this.onWheelEvent);
  }
}
