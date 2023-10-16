import { Timeline } from './timeline';
import { Signal } from '../utils';
import { Player } from './player';

export class CutScene {
  signals = {
    editorCleared: new Signal(),

    //animations

    animationAdded: new Signal(),
    animationRemoved: new Signal(),
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

  constructor() {
    this.signals.timeChanged.on(this.timeline.update);
  }

  play = () => {
    this.signals.playingChanged.emit(true);
  };

  stop = () => {
    this.signals.playingChanged.emit(false);
  };

  setTime = (time: number) => {
    this.player.currentTime = Math.max(0, time);
    this.signals.timeChanged.emit(time);
  };
}
