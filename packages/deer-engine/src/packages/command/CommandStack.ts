import { ICommand } from './ICommand';

export class CommandStack {
  private history: ICommand[] = [];
  private nowIndex = -1; // record index of last cmd executed

  public get size(): number {
    return this.history.length;
  }

  execute = (cmd: ICommand) => {
    try {
      cmd.execute();
      this.nowIndex++;

      // clear if here are dirty cmds.
      if (this.history[this.nowIndex] !== undefined) {
        this.history.splice(this.nowIndex);
      }
      this.history.push(cmd);
    } catch (err) {
      console.warn('execute failed: %s', cmd.toString());
      throw err;
    }
  };

  undo = () => {
    if (this.history.length === 0 || this.nowIndex < 0) return null;
    const cmd = this.history[this.nowIndex];
    try {
      cmd.undo();
      this.nowIndex--;
      return cmd;
    } catch (err) {
      console.warn('undo failed: %s', cmd.toString());
      throw err;
    }
  };

  redo = () => {
    if (this.history[this.nowIndex + 1] === undefined) return null;
    const cmd = this.history[this.nowIndex + 1];
    try {
      cmd.execute();
      this.nowIndex++;
      return cmd;
    } catch (err) {
      console.warn('redo failed: %s', cmd);
      throw err;
    }
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
