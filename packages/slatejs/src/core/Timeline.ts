import { AnimationUpdatedJson } from './clips';
import { isNil } from '../utils';
import { ActionClip } from './ActionClip';
import { CutSceneGroup } from './CutSceneGroup';

/**
 * Manage resource clips and sample resouces driven by player
 */
export class Timeline {
  private _animations: ActionClip[] = [];
  private _viewTimeMax = 500; // max seconds could be displayed in timeline
  private groups: CutSceneGroup[] = [];

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

  sample = (curTime: number, prevTime: number) => {
    this._animations.forEach((a) => a.onUpdate(curTime, prevTime));
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
