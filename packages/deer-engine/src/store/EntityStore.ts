import { CreateCommand, DeerScene } from '..';
import { StoreBase } from './StoreBase';

export class EntityStore extends StoreBase<any> {
  constructor(private engine: DeerScene) {
    super();
  }

  createEntity = () => {
    const cmd = new CreateCommand(this.engine.scene);
    this.engine.commandManager.execute(cmd);
    this.refreshData();
  };

  protected refreshData: () => void = () => {
    this.emit();
  };
}
