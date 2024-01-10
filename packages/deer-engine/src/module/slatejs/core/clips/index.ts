import { ActionClip } from '../ActionClip';
import { CutsceneTrack } from '../CutsceneTrack';
import { ActionClipData } from '../type';
import { AnimationClip } from './AnimationClip';
import { TransformClip } from './TransformClip';

export * from './AnimationClip';
export * from './TransformClip';

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
