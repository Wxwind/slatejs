import { ActionClipData } from './actionClip';

export type TrackType = 'Property' | 'Transform' | 'Camera';

export type TrackData = {
  id: string;
  name: string;
  children: ActionClipData[];
};
