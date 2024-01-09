import { CommandStack, ICommand } from '@/packages/command';
import { StoreBase } from '@/store';
import { isNil } from '@/util';
import { CommandType } from '../command';
import { DeerEngine } from '../DeerEngine';

export class CommandManager {
  private readonly commandStack: CommandStack;
  private readonly cmdToStoreMap: Partial<Record<CommandType, StoreBase[]>>;

  constructor(deerEngine: DeerEngine) {
    this.commandStack = new CommandStack();
    this.cmdToStoreMap = this.genCmdToStoreMap(deerEngine);
  }

  private genCmdToStoreMap = (deerEngine: DeerEngine) => {
    const cmdToStore: Partial<Record<CommandType, StoreBase[]>> = {
      Empty: [],
      CreateEntity: [],
      DeleteEntity: [],
    };
    return cmdToStore;
  };

  execute = (cmd: ICommand) => {
    this.commandStack.execute(cmd);
    this.cmdToStoreMap[cmd.type]?.forEach((s) => s.refreshData());
  };

  undo = () => {
    const cmd = this.commandStack.undo();
    if (isNil(cmd)) return;
    this.cmdToStoreMap[cmd.type]?.forEach((s) => s.refreshData());
  };

  redo = () => {
    const cmd = this.commandStack.redo();
    if (isNil(cmd)) return;
    this.cmdToStoreMap[cmd.type]?.forEach((s) => s.refreshData());
  };
}
