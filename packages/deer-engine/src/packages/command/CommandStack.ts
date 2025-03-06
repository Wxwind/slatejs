import { ICommand } from './ICommand';

export class CommandStack {
  private history: ICommand[] = [];
  private nowIndex = -1; // record index of last cmd executed
  private _isPending: boolean = false;

  public get size(): number {
    return this.history.length;
  }

  async execute(cmd: ICommand): Promise<void> {
    try {
      if (this._isPending) return;
      this._isPending = true;
      await cmd.execute(false);
      this.nowIndex++;

      // clear if here are dirty cmds.
      if (this.history[this.nowIndex] !== undefined) {
        this.history.splice(this.nowIndex);
      }
      this.history.push(cmd);
    } catch (err) {
      console.error('execute failed: %s', cmd.toString());
    } finally {
      this._isPending = false;
    }
  }

  async undo(): Promise<ICommand | null> {
    if (this.history.length === 0 || this.nowIndex < 0) return null;
    const cmd = this.history[this.nowIndex];
    try {
      if (this._isPending) return null;
      this._isPending = true;
      await cmd.undo();
      this.nowIndex--;
      return cmd;
    } catch (err) {
      console.error('undo failed: %s', cmd.toString());
      return null;
    } finally {
      this._isPending = false;
    }
  }

  async redo(): Promise<ICommand | null> {
    if (this.history[this.nowIndex + 1] === undefined) return null;
    const cmd = this.history[this.nowIndex + 1];
    try {
      if (this._isPending) return null;
      this._isPending = true;
      await cmd.execute(true);
      this.nowIndex++;
      return cmd;
    } catch (err) {
      console.error('redo failed: %s', cmd);
      return null;
    } finally {
      this._isPending = false;
    }
  }

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
