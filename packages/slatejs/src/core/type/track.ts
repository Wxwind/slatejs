import { ActionClipData } from './actionClip';

export type CutsceneTrackType = 'Property' | 'Transform' | 'Camera';

export type CutsceneTrackData = {
  id: string;
  name: string;
  type: string;
  children: ActionClipData[];
};
