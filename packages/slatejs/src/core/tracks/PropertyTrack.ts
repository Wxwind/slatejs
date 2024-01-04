import { genUUID } from '@/util';
import { ActionClip } from '../ActionClip';
import { CutsceneGroup } from '../CutsceneGroup';
import { CutsceneTrack } from '../CutsceneTrack';
import { IDirectable } from '../IDirectable';
import { CutsceneTrackData } from '../type';
import { constructClipFrom } from '../clips';

export class PropertyTrack extends CutsceneTrack<'Property'> {
  protected _type = 'Property' as const;

  get name(): string {
    return 'Property';
  }

  constructor(parent: IDirectable, id: string, name: string, clips: ActionClip[]) {
    super(parent, id, name, clips);
  }

  static constructFromJson(parent: CutsceneGroup, data: CutsceneTrackData) {
    const track = new PropertyTrack(parent, data.id, data.name, []);
    data.children.forEach((clipJson) => {
      track._clips.push(constructClipFrom(track, clipJson));
    });
    return track;
  }

  static construct(parent: CutsceneGroup, name: string) {
    return new PropertyTrack(parent, genUUID('cst'), name, []);
  }
}
