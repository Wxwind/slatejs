import { Timeline } from './Timeline';
import { Player } from './Player';
import { AnimationClip } from './resourceClip';
import { ResoucesStore, SelectedResouceStore, createScaleStore } from '../store';
import { Signal } from '../signal';

export class CutScene {
  signals = {
    editorCleared: new Signal(),

    //animations

    animationRenamed: new Signal(),
    animationModified: new Signal<[AnimationClip]>(),
    animationSelected: new Signal(),

    // events

    playingChanged: new Signal<[boolean]>(),
    timeChanged: new Signal<[number]>(),
    windowResized: new Signal(),
  };

  player = new Player();
  timeline = new Timeline();

  duration = 500; // total seconds in timeline

  private prevTime = 0;

  // export to SelectedResouceStore
  selectedAnim: AnimationClip | undefined;

  // store used only by react, expose internal apis and datas.
  resourcesStore = new ResoucesStore(this);

  selectedResourceStore = new SelectedResouceStore(this);

  // store to manage data used only for react
  useScaleStore = createScaleStore();

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

  selectAnimation = (animId: string) => {
    const anim = this.timeline.animations.find((a) => a.data.id === animId);
    if (anim === this.selectedAnim) return;
    this.selectedAnim = anim;
  };

  toJson = () => {};

  parseJson = () => {};
}
