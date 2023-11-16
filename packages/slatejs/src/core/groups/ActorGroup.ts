import { Entity } from 'deer-engine';
import { CutSceneGroup } from '../CutSceneGroup';

export class ActorGroup extends CutSceneGroup {
  protected _actor: Entity | null = null;

  get name(): string {
    return 'ActorGroup';
  }

  onEnter: () => void = () => {};
}
