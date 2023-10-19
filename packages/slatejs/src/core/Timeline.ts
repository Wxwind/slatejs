import { AnimationClip } from './resourceClip';

/**
 * Manage resource clips and sample resouces driven by player
 */
export class Timeline {
  private prevTime = 0;

  private animations: AnimationClip[] = [];

  update = (time: number) => {};

  addAnimation = (anim: AnimationClip) => {
    this.animations.push(anim);
  };

  removeAnimation = (anim: AnimationClip) => {
    const i = this.animations.indexOf(anim);

    if (i !== -1) {
      this.animations.splice(i, 1);
    }
  };
}
