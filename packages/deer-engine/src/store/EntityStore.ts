import { CreateCommand, DeerScene } from '..';
import { StoreBase } from './StoreBase';

export class EntityStore extends StoreBase<any> {
  constructor(private scene: DeerScene) {
    super();
  }

  /**
   * TODO: maybe it's better to move command execution to a single store which
   * manage the map of command and stores it need to refresh.
   */
  createEntity = () => {
    const cmd = new CreateCommand(this.scene, this.scene.scene);
    this.scene.commandManager.execute(cmd);
    this.refreshData();
  };

  refreshData: () => void = () => {
    this.emit();
  };
}
