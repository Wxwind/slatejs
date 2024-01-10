import { CutsceneTrackData } from './track';

export type CutsceneGroupType = 'Actor' | 'Director';

export type CutsceneGroupData = {
  id: string;
  name: string;
  entityId: string | undefined;
  children: CutsceneTrackData[];
};
