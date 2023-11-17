import { PlayState, CutsceneDirector } from './CutsceneDirector';
import { CutsceneDataStore as CutsceneDataStore, SelectedResouceStore, createScaleStore } from '../store';
import { Signal } from '../signal';
import { ActionClip } from './ActionClip';
import { IDirectable } from './IDirectable';

export class Cutscene {
  // bridge between cutscene core and cutscene ui.
  // TODO: may replace with external store.
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

  readonly director = new CutsceneDirector();

  private prevTime = 0;

  // export to SelectedResouceStore
  selectedObject: IDirectable | undefined;

  // store used only by react, expose internal (= cutscene core) apis and datas (sync data from core to store itself)
  readonly cutsceneDataStore = new CutsceneDataStore(this);
  readonly selectedResourceStore = new SelectedResouceStore(this);

  // store to manage data not concerned by cutscene core and used only for cutscene ui
  readonly useScaleStore = createScaleStore();

  public get viewTimeMax(): number {
    return this.director.viewTimeMax;
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
    this.director.tick(time - this.prevTime);
    if (this.director.playState !== PlayState.Stop) {
      this.signals.timeChanged.emit(this.director.currentTime);
    }

    this.prevTime = time;
    requestAnimationFrame(this.animate);
  };

  isPlaying = () => {
    return this.director.playState;
  };

  play = () => {
    this.director.play();
    this.signals.playingChanged.emit(true);
  };

  pause = () => {
    this.director.pause();
    this.signals.playingChanged.emit(false);
  };

  setTime = (time: number) => {
    this.director.currentTime = time;
    this.signals.timeChanged.emit(this.director.currentTime);
  };

  selectObject = (groupid: string) => {
    // FIXME
    const obj = this.director.findGroup(groupid);
    if (obj === this.selectedObject) return;
    this.selectedObject = obj;
  };

  toJson = () => {
    return this.director.toJson();
  };

  parseJson = (json: string) => {
    this.director.parseJson(json);
  };
}
