import { AnimationClip } from './resourceClip';

/**
 * Manage resource clips and sample resouces driven by player
 */
export class Timeline {
  private prevTime = 0;

  private _animations: AnimationClip[] = [];

  public get animations(): AnimationClip[] {
    return this._animations;
  }

  update = (time: number) => {};

  addAnimation = (anim: AnimationClip) => {
    this._animations.push(anim);
  };

  removeAnimation = (anim: AnimationClip) => {
    const i = this._animations.indexOf(anim);

    if (i !== -1) {
      this._animations.splice(i, 1);
    }
  };
}
