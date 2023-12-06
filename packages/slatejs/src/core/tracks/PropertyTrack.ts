import { CutsceneTrack } from '../CutsceneTrack';
import { IDirectable } from '../IDirectable';

export class PropertyTrack extends CutsceneTrack<'Property'> {
  protected _type = 'Property' as const;

  get name(): string {
    return 'Property';
  }

  constructor(parent: IDirectable) {
    super(parent);
  }
}
