import { CommandStack, ICommand } from '@/packages/command';
import { isNil } from '@/util';

export class CommandManager {
  private readonly commandStack: CommandStack;

  constructor() {
    this.commandStack = new CommandStack();
  }

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
}
