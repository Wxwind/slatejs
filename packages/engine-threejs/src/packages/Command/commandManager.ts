import { ICommand } from './command';

export class CommandManager {
  private history: ICommand[] = [];
  private nowIndex = -1; // record index of last cmd executed

  public get size(): number {
    return this.history.length;
  }

  execute = (cmd: ICommand) => {
    cmd.execute();
    this.nowIndex++;

    // clear if here were dirty cmds.
    if (this.history[this.nowIndex] !== undefined) {
      this.history.splice(this.nowIndex);
    }
    this.history.push(cmd);
  };

  undo = () => {
    if (this.history.length === 0) return false;
    const cmd = this.history[this.history.length - 1];
    cmd.undo();
    this.nowIndex--;
    return true;
  };

  redo = () => {
    if (this.history[this.nowIndex + 1] === undefined) return false;
    this.history[this.nowIndex + 1].execute();
    this.nowIndex++;
    return true;
  };

  top = () => {
    if (this.nowIndex < 0 || this.nowIndex >= this.history.length) {
      return null;
    }
    return this.history[this.nowIndex];
  };

  clear = () => {
    this.history = [];
    this.nowIndex = -1;
  };
}
