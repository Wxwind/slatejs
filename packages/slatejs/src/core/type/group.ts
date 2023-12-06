import { TrackData } from './track';

export type GroupType = 'Actor' | 'Director';

export type GroupData = {
  id: string;
  name: string;
  entityId: string | undefined;
  children: TrackData[];
};
