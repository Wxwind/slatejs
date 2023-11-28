import { Entity } from 'deer-engine';
import { CutsceneGroup } from '../CutsceneGroup';

export class ActorGroup extends CutsceneGroup {
  protected _actor: Entity | undefined;

  get name(): string {
    return 'ActorGroup';
  }

  onEnter: () => void = () => {};
}
