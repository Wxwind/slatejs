import { Entity } from 'deer-engine';
import { CutsceneGroup } from '../CutsceneGroup';

export class ActorGroup extends CutsceneGroup {
  protected _actor: Entity | null = null;

  get name(): string {
    return 'ActorGroup';
  }

  onEnter: () => void = () => {};
}
