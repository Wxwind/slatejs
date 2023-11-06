import { AnimationUpdatedJson } from './clips';
import { isNil } from '../utils';
import { ActionClip } from './ActionClip';
import { CutSceneGroup } from './CutSceneGroup';
import { EndTimePointer, IDirectableTimePointer, StartTimePointer } from './TimePointer';
import { startTransition } from 'react';

/**
 * Manage resource clips and sample resouces driven by player
 */
export class Timeline {
  private _animations: ActionClip[] = [];
  private _viewTimeMax = 500; // max seconds could be displayed in timeline
  private _groups: CutSceneGroup[] = [];
  private _prevTime = 0;
  private _curTime = 0;

  private _timePointers: IDirectableTimePointer[] = [];
  private _startTimePointers: IDirectableTimePointer[] = [];

  // Expose to ResoucesStore
  public get animations(): ActionClip[] {
    return this._animations;
  }

  public get viewTimeMax(): number {
    return this._viewTimeMax;
  }
  public set viewTimeMax(v: number) {
    this._viewTimeMax = v;
  }

  public get curTime(): number {
    return this._curTime;
  }

  sample = (curTime: number) => {
    this._curTime = curTime;

    if (this._prevTime === this._curTime) {
      return;
    }

    // init
    if (this._curTime > 0 && this._prevTime === 0) {
      this.initializeTimePointers();
    }

    // sample
    if (this._timePointers.length > 0) {
      this.sampleTimepointers(this._curTime, this._prevTime);
    }

    this._prevTime = this._curTime;
  };

  // Initialize start time pointers bottom to top.
  // Initialize start&end time pointers by the time pointed.
  // Make sure the timepointer event order is
  // group enter -> track enter -> clip enter -> clip exit -> track exit -> group exit
  private initializeTimePointers = () => {
    const timePointers: IDirectableTimePointer[] = [];
    const startTimePointers: IDirectableTimePointer[] = [];

    for (const group of [...this._groups].reverse()) {
      if (group.isActive && group.onInitialize()) {
        const p1 = new StartTimePointer(group);
        timePointers.push(p1);

        for (const track of [...group.children].reverse()) {
          if (track.isActive && track.onInitialize()) {
            const p2 = new StartTimePointer(track);
            timePointers.push(p2);

            for (const clip of [...track.children].reverse()) {
              if (clip.isActive && track.onInitialize()) {
                const p3 = new StartTimePointer(clip);
                timePointers.push(p3);

                startTimePointers.push(p3);
                timePointers.push(new EndTimePointer(clip));
              }
            }

            startTimePointers.push(p2);
            timePointers.push(new EndTimePointer(track));
          }
        }

        startTimePointers.push(p1);
        timePointers.push(new EndTimePointer(group));
      }
    }

    timePointers.sort((p1, p2) => p1.time - p2.time);
    this._timePointers = timePointers;
    this._startTimePointers = startTimePointers;
  };

  private sampleTimepointers = (curTime: number, prevTime: number) => {
    if (curTime > prevTime) {
      for (const p of this._timePointers) {
        p.triggerForward(curTime, prevTime);
      }
    } else if (curTime < prevTime) {
      for (const p of this._timePointers) {
        p.triggerBackward(curTime, prevTime);
      }
    }

    for (const p of this._startTimePointers) {
      p.update(curTime, prevTime);
    }
  };

  findAnimation = (id: string) => {
    const anim = this._animations.find((a) => a.data.id === id);
    if (isNil(anim)) throw new Error(`couldn't find animation (id = ${id})`);
    return anim;
  };

  addAnimation = (anim: ActionClip) => {
    this._animations.push(anim);
  };

  updateAnimation = (id: string, delta: AnimationUpdatedJson) => {
    const anim = this.findAnimation(id);
    anim.data = { ...anim.data, ...delta };
  };

  removeAnimation = (anim: ActionClip) => {
    const i = this._animations.indexOf(anim);

    if (i !== -1) {
      this._animations.splice(i, 1);
    }
  };
}
