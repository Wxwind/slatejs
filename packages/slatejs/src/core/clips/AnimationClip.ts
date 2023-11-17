import { genUUID } from '@/utils';
import { ActionClipData, ClipType } from '../type';
import { ActionClip } from '../ActionClip';
import { IDirectable } from '../IDirectable';
import { CutsceneTrack } from '../CutsceneTrack';

export class AnimationClip extends ActionClip {
  data: AnimationClipData;

  get type(): ClipType {
    return 'Animation';
  }

  constructor(parent: IDirectable, data: AnimationClipData) {
    super(parent);
    this.data = data;
  }

  static construct(parent: CutsceneTrack, name: string, start: number, end: number, layerId: string) {
    const id = genUUID();
    return new AnimationClip(parent, { id, name, start, end, layerId });
  }
}

export interface AnimationClipData extends ActionClipData {}

export type UpdateAnimationDataDto = Partial<Omit<AnimationClipData, 'id'>>;
