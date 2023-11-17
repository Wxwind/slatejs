import { ActionClip } from '../ActionClip';
import { CutsceneDirector } from '../CutsceneDirector';
import { CutsceneTrack } from '../CutsceneTrack';
import { IDirectable } from '../IDirectable';

export class TransformTrack extends CutsceneTrack {
  get name(): string {
    return 'TransformTrack';
  }

  constructor(parent: IDirectable) {
    super(parent);
  }
}
