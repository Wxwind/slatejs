import { CommandStack, ICommand } from '@/packages/command';
import { StoreBase } from '@/store';
import { CommandId, DeerScene } from '..';
import { isNil } from '@/util';

export class CommandManager {
  private commandManager: CommandStack;
  private readonly cmdToStoreMap: Record<CommandId, StoreBase[]>;

  constructor(scene: DeerScene) {
    this.commandManager = scene.commandStack;
    this.cmdToStoreMap = this.genCmdToStoreMap(scene);
  }

  private genCmdToStoreMap = (scene: DeerScene) => {
    const entityStore = scene.entityStore;
    const cmdToStore: Record<CommandId, StoreBase[]> = {
      Empty: [],
      CreateEntity: [entityStore],
      DeleteEntity: [entityStore],
    };
    return cmdToStore;
  };

  execute = (cmd: ICommand) => {
    this.commandManager.execute(cmd);
    this.cmdToStoreMap[cmd.id].forEach((s) => s.refreshData());
  };

  undo = () => {
    const cmd = this.commandManager.undo();
    if (isNil(cmd)) return;
    this.cmdToStoreMap[cmd.id].forEach((s) => s.refreshData());
  };

  redo = () => {
    const cmd = this.commandManager.redo();
    if (isNil(cmd)) return;
    this.cmdToStoreMap[cmd.id].forEach((s) => s.refreshData());
  };
}
