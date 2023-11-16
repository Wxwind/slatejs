import { Entity } from 'deer-engine';
import { CutSceneGroup } from '../CutSceneGroup';

export class DirectorGroup extends CutSceneGroup {
  protected _actor: Entity | null = null;

  get name(): string {
    return 'DirectorGroup';
  }

  onEnter: () => void = () => {};
}
