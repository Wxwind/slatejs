import { ActionClip } from '../ActionClip';
import { CutSceneDirector } from '../CutSceneDirector';
import { CutSceneTrack } from '../CutSceneTrack';
import { IDirectable } from '../IDirectable';

export class TransformTrack extends CutSceneTrack {
  get name(): string {
    return 'TransformTrack';
  }

  constructor(parent: IDirectable) {
    super(parent);
  }
}
