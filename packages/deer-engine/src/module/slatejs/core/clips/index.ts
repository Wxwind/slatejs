import { ActionClip } from '../ActionClip';
import { CutsceneTrack } from '../CutsceneTrack';
import { ActionClipData } from '../type';
import { AnimationClip } from './AnimationClip';
import { TransformClip } from './ActionTrack/TransformClip';

export * from './AnimationClip';
export * from './ActionTrack';

export function constructClipFrom(parent: CutsceneTrack, data: ActionClipData): ActionClip {
  switch (data.type) {
    case 'Animation':
      return AnimationClip.constructFromJson(parent, data);
    case 'Transform':
      return TransformClip.constructFromJson(parent, data);
    default:
      throw new Error(`${data.type} is invalid clip type`);
  }
}
