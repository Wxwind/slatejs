import { ICommand } from './ICommand';

export class CommandStack {
  private history: ICommand[] = [];
  private nowIndex = -1; // record index of last cmd executed

  public get size(): number {
    return this.history.length;
  }

  execute = (cmd: ICommand) => {
    const isOk = cmd.execute();
    if (!isOk) {
      console.warn('execute failed: %s', cmd.toString());
      return;
    }
    this.nowIndex++;

    // clear if here are dirty cmds.
    if (this.history[this.nowIndex] !== undefined) {
      this.history.splice(this.nowIndex);
    }
    this.history.push(cmd);
  };

  undo = () => {
    if (this.history.length === 0 || this.nowIndex < 0) return null;
    const cmd = this.history[this.nowIndex];
    const isOk = cmd.undo();
    if (!isOk) {
      console.warn('undo failed: %s', cmd.toString());
    }
    this.nowIndex--;
    return cmd;
  };

  redo = () => {
    if (this.history[this.nowIndex + 1] === undefined) return null;
    const cmd = this.history[this.nowIndex + 1];
    const isOk = cmd.execute();
    if (!isOk) {
      console.warn('redo failed: %s', cmd);
      return;
    }
    this.nowIndex++;
    return cmd;
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
