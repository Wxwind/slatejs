import { CommandStack, ICommand } from '@/packages/command';
import { StoreBase } from '@/store';
import { isNil } from '@/util';
import { CommandId } from '../command';
import { DeerEngine } from '../DeerEngine';

export class CommandManager {
  private readonly commandStack: CommandStack;
  private readonly cmdToStoreMap: Record<CommandId, StoreBase[]>;

  constructor(deerEngine: DeerEngine) {
    this.commandStack = new CommandStack();
    this.cmdToStoreMap = this.genCmdToStoreMap(deerEngine);
  }

  private genCmdToStoreMap = (deerEngine: DeerEngine) => {
    const hierarchyStore = deerEngine.deerStore.hierarchyStore;
    const selectedEntityIdStore = deerEngine.deerStore.selectedEntityIdStore;

    const cmdToStore: Record<CommandId, StoreBase[]> = {
      Empty: [],
      CreateEntity: [hierarchyStore],
      DeleteEntity: [hierarchyStore],
      SelectEntity: [selectedEntityIdStore, hierarchyStore],
    };
    return cmdToStore;
  };

  execute = (cmd: ICommand) => {
    this.commandStack.execute(cmd);
    this.cmdToStoreMap[cmd.id].forEach((s) => s.refreshData());
  };

  undo = () => {
    const cmd = this.commandStack.undo();
    if (isNil(cmd)) return;
    this.cmdToStoreMap[cmd.id].forEach((s) => s.refreshData());
  };

  redo = () => {
    const cmd = this.commandStack.redo();
    if (isNil(cmd)) return;
    this.cmdToStoreMap[cmd.id].forEach((s) => s.refreshData());
  };
}
