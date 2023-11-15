import { Entity } from 'deer-engine';
import { CutSceneGroup } from '../CutSceneGroup';

export class ActorGroup extends CutSceneGroup {
  protected actor: Entity | null = null;

  onEnter: () => void = () => {};
}
