import { ActionClipData } from './actionClip';

export type CutsceneTrackType = 'Action' | 'Transform' | 'Camera';

export type CutsceneTrackData = {
  id: string;
  name: string;
  type: string;
  children: ActionClipData[];
};
