import { CutsceneGroupData } from './group';

export type CutsceneData = {
  version: string;
  data: CutsceneGroupData[];
};

/**
 * PlayState in editor mode has no state called 'paused' because
 * 'paused' is the same as 'stopped'
 */
export enum PlayState {
  Stop = 'Stop',
  PlayForward = 'PlayForward',
  PlayBackward = 'PlayBackward',
}

export type PlayWrapMode = 'once' | 'loop' | 'pingPong';

export type PlayStopMode = 'skip' | 'rewind' | 'hold' | 'skipRewindNoUndo';

export type PlayDirection = 'forwards' | 'backwards';

export type PlayOptions = Partial<{
  startTime: number;
  endTime: number;
  wrapMode: PlayWrapMode;
  playDirection: PlayDirection;

  onFinished: () => void;
}>;
