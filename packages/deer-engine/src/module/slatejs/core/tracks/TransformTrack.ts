import { genUUID } from '@/util';
import { CutsceneGroup } from '../CutsceneGroup';
import { CutsceneTrack } from '../CutsceneTrack';
import { IDirectable } from '../IDirectable';
import { CutsceneTrackData } from '../type';
import { ActionClip } from '../ActionClip';
import { constructClipFrom } from '../clips';

export class TransformTrack extends CutsceneTrack<'Transform'> {
  protected _type = 'Transform' as const;

  get name(): string {
    return 'Transform';
  }

  constructor(parent: IDirectable, id: string, name: string, clips: ActionClip[]) {
    super(parent, id, name, clips);
  }

  static constructFromJson(parent: CutsceneGroup, data: CutsceneTrackData) {
    const track = new TransformTrack(parent, data.id, data.name, []);
    data.children.forEach((clipJson) => {
      track._clips.push(constructClipFrom(track, clipJson));
    });
    return track;
  }

  static construct(parent: CutsceneGroup, name: string) {
    return new TransformTrack(parent, genUUID('cst'), name, []);
  }
}
