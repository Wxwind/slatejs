import { Vector3 } from 'deer-engine';
import { AnimationClip, TransformClip } from '../clips';

export type ClipType = 'Transform' | 'Animation';

export type TransformKeys = {
  id: string;
  time: number; // local time
  position: Vector3;
};

export type AnimationKeys = {
  id: string;
  time: number;
  referenceAnimId: string;
};

export type ActionClipTypeToKeyMap = {
  Animation: AnimationKeys;
  Transform: TransformKeys;
};

type ActionClipTypeToDataMap = {
  [K in ClipType]: {
    start: number;
    end: number;
    id: string;
    name: string;
    type: K;
    keys: ActionClipTypeToKeyMap[K][];
  };
};

export type ActionClipData<T extends ClipType = ClipType> = ActionClipTypeToDataMap[T];

export type CreateActionClipDto<T extends ClipType = ClipType> = Omit<ActionClipTypeToDataMap[T], 'id' | 'type'>;
export type UpdateActionClipDto<T extends ClipType = ClipType> = Partial<
  Omit<ActionClipTypeToDataMap[T], 'id' | 'type'>
>;

export type ActionClip = AnimationClip | TransformClip;
