import { Entity } from 'deer-engine';
import { CutsceneGroup } from '../CutsceneGroup';

export class DirectorGroup extends CutsceneGroup {
  protected _actor: Entity | undefined;

  get name(): string {
    return 'DirectorGroup';
  }

  onEnter: () => void = () => {};
}
