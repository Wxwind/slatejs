import { isNil } from '../utils';
import { AnimationClip, AnimationJson, AnimationUpdatedJson } from './resourceClip';

/**
 * Manage resource clips and sample resouces driven by player
 */
export class Timeline {
  private prevTime = 0;

  private _animations: AnimationClip[] = [];

  // Expose to ResoucesStore
  public get animations(): AnimationClip[] {
    return this._animations;
  }

  update = (time: number) => {};

  findAnimation = (id: string) => {
    const anim = this._animations.find((a) => a.data.id === id);
    if (isNil(anim)) throw new Error(`couldn't find animation (id = ${id})`);
    return anim;
  };

  addAnimation = (anim: AnimationClip) => {
    this._animations.push(anim);
  };

  updateAnimation = (id: string, delta: AnimationUpdatedJson) => {
    const anim = this.findAnimation(id);
    anim.data = { ...anim.data, ...delta };
  };

  removeAnimation = (anim: AnimationClip) => {
    const i = this._animations.indexOf(anim);

    if (i !== -1) {
      this._animations.splice(i, 1);
    }
  };
}
