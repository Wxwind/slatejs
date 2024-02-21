import { ActionClipData } from './actionClip';

export type CutsceneTrackType = 'ActionTrack' | 'AnimationTrack' | 'CameraTrack';

export type CutsceneTrackData = {
  id: string;
  name: string;
  children: ActionClipData[];
};
