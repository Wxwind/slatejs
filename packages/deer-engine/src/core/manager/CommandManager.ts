import { CommandStack, ICommand } from '@/packages/command';
import { isNil } from '@/util';
import { AbstractManager } from '../interface';

export class CommandManager extends AbstractManager {
  private readonly commandStack = new CommandStack();

  init(): void {}

  execute = (cmd: ICommand) => {
    this.commandStack.execute(cmd);
  };

  undo = () => {
    const cmd = this.commandStack.undo();
    if (isNil(cmd)) return;
    console.log(`undo the cmd ${cmd.type}`);
  };

  redo = () => {
    const cmd = this.commandStack.redo();
    if (isNil(cmd)) return;
    console.log(`redo the cmd ${cmd.type}`);
  };

  destroy(): void {
    this.commandStack.clear();
  }
}
