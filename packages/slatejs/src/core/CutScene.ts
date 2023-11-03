import { Timeline } from './Timeline';
import { PlayState, CutSceneDirector } from './CutSceneDirector';
import { ResoucesStore, SelectedResouceStore, createScaleStore } from '../store';
import { Signal } from '../signal';
import { ActionClip } from './ActionClip';

export class CutScene {
  // bridge between cutscene core and cutscene ui.
  // TODO: may replace s external store.
  readonly signals = {
    editorCleared: new Signal(),

    //animations

    // animationRenamed: new Signal(),
    // animationModified: new Signal<[AnimationClip]>(),
    // animationSelected: new Signal(),

    // events

    playingChanged: new Signal<[boolean]>(),
    timeChanged: new Signal<[number]>(),
    windowResized: new Signal(),
  };

  readonly timeline = new Timeline();
  readonly player = new CutSceneDirector(this.timeline);

  private prevTime = 0;

  // export to SelectedResouceStore
  selectedAnim: ActionClip | undefined;

  // store used only by react, expose internal (= cutscene core) apis and datas (sync data from core to store itself)
  readonly resourcesStore = new ResoucesStore(this);
  readonly selectedResourceStore = new SelectedResouceStore(this);

  // store to manage data not concerned by cutScene core and used only for cutScene ui
  readonly useScaleStore = createScaleStore();

  public get viewTimeMax(): number {
    return this.timeline.viewTimeMax;
  }

  constructor() {
    this.init();
  }

  private init = () => {
    const time = performance.now();
    this.prevTime = time;
    this.animate(time);
  };

  private animate = (time: number) => {
    this.player.tick(time - this.prevTime);
    if (this.player.playState !== PlayState.Stop) {
      this.signals.timeChanged.emit(this.player.currentTime);
    }

    this.prevTime = time;
    requestAnimationFrame(this.animate);
  };

  isPlaying = () => {
    return this.player.playState;
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
    this.player.currentTime = time;
    this.signals.timeChanged.emit(this.player.currentTime);
  };

  selectAnimation = (animId: string) => {
    const anim = this.timeline.animations.find((a) => a.data.id === animId);
    if (anim === this.selectedAnim) return;
    this.selectedAnim = anim;
  };

  toJson = () => {};

  parseJson = () => {};
}
