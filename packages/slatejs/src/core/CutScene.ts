import { Timeline } from './Timeline';
import { Signal } from '../utils';
import { Player } from './Player';
import { AnimationClip } from './resourceClip';
import { ResoucesStore } from '../store';

export class CutScene {
  signals = {
    editorCleared: new Signal(),

    //animations

    animationAdded: new Signal<[AnimationClip]>(),
    animationRemoved: new Signal<[AnimationClip]>(),
    animationRenamed: new Signal(),
    animationModified: new Signal(),
    animationSelected: new Signal(),

    // events

    playingChanged: new Signal<[boolean]>(),
    timeChanged: new Signal<[number]>(),
    timelineScaled: new Signal<[number]>(),
    windowResized: new Signal(),
  };

  player = new Player();
  timeline = new Timeline();

  duration = 500; // total seconds in timeline

  private prevTime = 0;

  // store used only by react, expose internal apis and datas.
  resourcesStore = new ResoucesStore(this);

  constructor() {
    this.signals.timeChanged.on(this.timeline.update);
    this.init();
  }

  private init = () => {
    const time = performance.now();
    this.prevTime = time;
    this.animate(time);
  };

  private animate = (time: number) => {
    this.player.tick(time - this.prevTime);
    if (this.player.isPlaying) {
      this.signals.timeChanged.emit(this.player.currentTime);
    }

    this.prevTime = time;
    requestAnimationFrame(this.animate);
  };

  isPlaying = () => {
    return this.player.isPlaying;
  };

  play = () => {
    this.player.play();
    this.signals.playingChanged.emit(true);
  };

  pause = () => {
    this.player.pause();
    this.signals.playingChanged.emit(false);
  };

  setTime = (time: number) => {
    this.player.currentTime = Math.max(0, time);
    this.signals.timeChanged.emit(time);
  };

  addAnimation = (anim: AnimationClip) => {
    this.timeline.addAnimation(anim);
    this.signals.animationAdded.emit(anim);
  };

  removeAnimation = (anim: AnimationClip) => {
    this.timeline.removeAnimation(anim);
    this.signals.animationRemoved.emit(anim);
  };

  toJson = () => {};

  parseJson = () => {};
}
