import { IDirectable, IDirectableGetLengh, IDirectableToLocalTime } from './IDirectable';

export interface IDirectableTimePointer {
  get target(): IDirectable;
  get time(): number;

  triggerForward: (curTime: number, prevTime: number) => void;

  triggerBackward: (curTime: number, prevTime: number) => void;

  update: (curTime: number, prevTime: number) => void;
}

export class StartTimePointer implements IDirectableTimePointer {
  private _target: IDirectable;

  private _isTrigged: boolean;
  private _lastStartTime: number;

  get target(): IDirectable {
    return this._target;
  }

  get time(): number {
    return this.target.startTime;
  }

  constructor(target: IDirectable) {
    this._target = target;
    this._isTrigged = false;
    this._lastStartTime = target.startTime;
  }

  triggerForward = (curTime: number, prevTime: number) => {
    if (curTime >= this.time) {
      if (!this._isTrigged) {
        console.log('startTimePointer: target Enter in TriggerForward');
        this._isTrigged = true;
        this.target.onEnter();
        this.target.onUpdate(IDirectableToLocalTime(this.target, curTime), 0);
      }
    }
  };

  triggerBackward = (curTime: number, prevTime: number) => {
    // curTime <= 0 means end play and exit cutScene controlled mode (will restore origin state).
    // curTime <= 0 happens in click stop btn by user or playReverse().
    // Q: why need curTime <= 0 ?
    // A: the ideal condition is curTime <= this.time, but this way will
    // causes onReverseExit() in triggerBackward() will be called immediately
    // after onEnter() in triggerForward(). So we need <= 0 to make sure
    // onReverseExit can be trigged for IDirectables whose start time = 0
    if (curTime < this.time || curTime <= 0) {
      if (this._isTrigged) {
        console.log('startTimePointer: target ReverseExit in TriggerBackward');
        this._isTrigged = false;
        this.target.onUpdate(0, IDirectableToLocalTime(this.target, prevTime));
        this.target.onReverseExit();
      }
    }
  };

  update = (curTime: number, prevTime: number) => {
    if (
      curTime >= this.target.startTime &&
      curTime < this.target.endTime &&
      curTime > 0 &&
      curTime < (this.target.root?.playTimeLength || Number.MAX_SAFE_INTEGER)
    ) {
      const delta = this.target.startTime - this._lastStartTime;
      const localCurTime = IDirectableToLocalTime(this.target, curTime);
      const localPrevTime = IDirectableToLocalTime(this.target, prevTime + delta);

      this.target.onUpdate(localCurTime, localPrevTime);
      this._lastStartTime = this.target.startTime;
    }
  };
}

export class EndTimePointer implements IDirectableTimePointer {
  private _target: IDirectable;

  private _isTrigged: boolean;

  get target(): IDirectable {
    return this._target;
  }

  get time(): number {
    return this.target.endTime;
  }

  constructor(target: IDirectable) {
    this._target = target;
    this._isTrigged = false;
  }

  triggerForward = (curTime: number, prevTime: number) => {
    if (
      curTime >= this.target.endTime ||
      (curTime === this.target.root?.playTimeLength && this.target.startTime < this.target.root.playTimeLength)
    ) {
      if (!this._isTrigged) {
        this._isTrigged = true;
        console.log('entTimePointer: target Exit in TriggerForward');
        this.target.onUpdate(IDirectableGetLengh(this.target), IDirectableToLocalTime(this.target, prevTime));
        this.target.onExit();
      }
    }
  };

  triggerBackward = (curTime: number, prevTime: number) => {
    if ((curTime < this.target.endTime || curTime <= 0) && curTime !== this.target.root?.playTimeLength) {
      if (this._isTrigged) {
        this._isTrigged = false;
        console.log('endTimePointer: target ReverseEnter in TriggerBackward');
        this.target.onReverseEnter();
        this.target.onUpdate(IDirectableToLocalTime(this.target, curTime), IDirectableGetLengh(this.target));
      }
    }
  };

  update = (curTime: number, prevTime: number) => {
    throw new Error('EndTimePointer should never be called');
  };
}
