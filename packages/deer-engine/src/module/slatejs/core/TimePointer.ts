import { IDirectable, IDirectableGetLengh, IDirectableToLocalTime } from './IDirectable';

export interface IDirectableTimePointer {
  get target(): IDirectable;
  get time(): number;

  triggerForward: (curTime: number, prevTime: number) => void;
  triggerBackward: (curTime: number, prevTime: number) => void;
}

export class StartTimePointer implements IDirectableTimePointer {
  private _target: IDirectable;

  private _isTrigged: boolean;

  get target(): IDirectable {
    return this._target;
  }

  get time(): number {
    return this.target.startTime;
  }

  constructor(target: IDirectable) {
    this._target = target;
    this._isTrigged = false;
  }

  triggerForward = (curTime: number, prevTime: number) => {
    // IDirectable's startTime-endTime means [startTime, endTime) when play forward and
    // [endTime, startTime) when play backward.
    if (curTime >= this.target.startTime) {
      if (!this._isTrigged) {
        console.log('startTimePointer: target Enter in TriggerForward');
        this._isTrigged = true;
        this.target.onEnter();
        this.target.onUpdate(IDirectableToLocalTime(this.target, curTime), 0);
      }
    }
  };

  triggerBackward = (curTime: number, prevTime: number) => {
    // curTime <= 0 means end play and exit cutscene controlled mode (will restore to its original state)
    // for CutsceneGroup when clicking stop btn by user or playReverse() to end.
    // Q: why need 'curTime <= 0' ? Why not just 'curTime <= this.target.startTime' ?
    // A: curTime <= this.target.startTime will cause folling problems:
    // 1. will causes onReverseExit() in triggerBackward() will be called immediately
    // after onEnter() in triggerForward() if curTime === this.target.startTime.
    // 2. will be trigged accidently. For example, clip's time is 5~8s, but we play the Cutscene backward
    // from 5s to 2s (means [5,2) exactly), onReverseExit() will be raised.
    // So we need <= 0 to make sure onReverseExit can be trigged for IDirectables whose start time = 0
    if (curTime < this.target.startTime || curTime <= 0) {
      if (this._isTrigged) {
        console.log('startTimePointer: target ReverseExit in TriggerBackward');
        this._isTrigged = false;
        this.target.onUpdate(0, IDirectableToLocalTime(this.target, prevTime));
        this.target.onReverseExit();
      }
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
}

export class UpdateTimePointer {
  private _target: IDirectable;

  private _lastTargetStartTime: number;

  get target(): IDirectable {
    return this._target;
  }

  get time(): number {
    return this.target.endTime;
  }

  constructor(target: IDirectable) {
    this._target = target;
    this._lastTargetStartTime = target.startTime;
  }

  update = (curTime: number, prevTime: number) => {
    if (
      curTime >= this.target.startTime &&
      curTime < this.target.endTime &&
      curTime > 0 &&
      curTime < (this.target.root?.playTimeLength || Number.MAX_SAFE_INTEGER)
    ) {
      const delta = this.target.startTime - this._lastTargetStartTime;
      const localCurTime = IDirectableToLocalTime(this.target, curTime);
      const localPrevTime = IDirectableToLocalTime(this.target, prevTime + delta);

      this.target.onUpdate(localCurTime, localPrevTime);
      // target.startTime may update when playing
      this._lastTargetStartTime = this.target.startTime;
    }
  };
}
