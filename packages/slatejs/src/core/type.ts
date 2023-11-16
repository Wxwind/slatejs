export type CutSceneData = {
  version: string;
  data: GroupData[];
};

export type GroupData = {
  id: string;
  name: string;
  entityId: string | undefined;
  children: TrackData[];
};

export type TrackData = {
  id: string;
  name: string;
  children: ActionClipData[];
};

export type ActionClipData = {
  start: number;
  end: number;
  id: string;
  layerId: string;
  name: string;
};

export type GroupType = 'Actor' | 'Director';
export type TrackType = 'Transform';
export type ClipType = 'Animation';
