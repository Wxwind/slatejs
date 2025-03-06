import { CommandStack, ICommand } from '@/packages/command';
import { isNil } from '@/util';
import { AbstractManager } from '../interface';

export class CommandManager extends AbstractManager {
  private readonly commandStack = new CommandStack();

  init(): void {}

  async execute(cmd: ICommand) {
    await this.commandStack.execute(cmd);
  }

  async undo() {
    const cmd = await this.commandStack.undo();
    if (isNil(cmd)) return;
    console.log(`undo the cmd ${cmd.type}`);
  }

  async redo() {
    const cmd = await this.commandStack.redo();
    if (isNil(cmd)) return;
    console.log(`redo the cmd ${cmd.type}`);
  }

  destroy(): void {
    this.commandStack.clear();
  }
}
