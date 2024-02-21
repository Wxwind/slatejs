import { genUUID } from '@/util';
import { CutsceneGroup } from '../CutsceneGroup';
import { CutsceneTrack } from '../CutsceneTrack';
import { IDirectable } from '../IDirectable';
import { CutsceneTrackData } from '../type';
import { ActionClip } from '../ActionClip';
import { constructClipFrom } from '../clips';
import { egclass } from '@/core';

@egclass()
export class AnimationTrack extends CutsceneTrack {
  constructor(parent: IDirectable, id: string, name: string, clips: ActionClip[]) {
    super(parent, id, name, clips);
  }

  static constructFromJson(parent: CutsceneGroup, data: CutsceneTrackData) {
    const track = new AnimationTrack(parent, data.id, data.name, []);
    data.children.forEach((clipJson) => {
      track._clips.push(constructClipFrom(track, clipJson));
    });
    return track;
  }

  static construct(parent: CutsceneGroup, name: string) {
    return new AnimationTrack(parent, genUUID('cst'), name, []);
  }
}
