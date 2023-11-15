import { Entity } from 'deer-engine';
import { CutSceneGroup } from '../CutSceneGroup';

export class DirectorGroup extends CutSceneGroup {
  protected actor: Entity | null = null;

  onEnter: () => void = () => {};
}
