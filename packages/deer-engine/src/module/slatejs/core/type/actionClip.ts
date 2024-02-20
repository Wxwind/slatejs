import { PartialSome } from '@/util';
import { AnimatedParameterCollectionJson } from '../AnimatedParameterCollection';

export type ClipType = 'Transform' | 'Animation' | 'Properties';

export type ActionClipData = {
  id: string;
  name: string;
  startTime: number;
  endTime: number;
  type: ClipType;
  animatedParams: AnimatedParameterCollectionJson;
};

export type CreateActionClipByJsonDto = Omit<ActionClipData, 'type'>;
export type CreateActionClipDto = PartialSome<Omit<ActionClipData, 'type' | 'id' | 'animatedParams'>, 'name'>;
export type UpdateActionClipDto = Partial<{ name: string; startTime: number; endTime: number }>;
