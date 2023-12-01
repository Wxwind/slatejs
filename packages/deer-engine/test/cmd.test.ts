import { CommandStack, ICommand } from '../src/packages/command';
import { CommandType } from '../src/core/command';

export class EmptyCommand implements ICommand {
  constructor(private name: string) {}
  type: CommandType = 'CreateEntity';

  execute = () => {
    console.log(`command '${this.name}' execute`);
    return true;
  };
  undo = () => {
    console.log(`command '${this.name}' undo`);
    return true;
  };
  toString = () => {
    return `EmptyCommand: name = '${this.name}' `;
  };
}

const cmd1 = new EmptyCommand('step1');
const cmd2 = new EmptyCommand('step2');
const cmd3 = new EmptyCommand('step3');
const cmd4 = new EmptyCommand('step4');

test('exec cmd123', () => {
  const cmdMgr = new CommandStack();
  cmdMgr.execute(cmd1);
  cmdMgr.execute(cmd2);
  cmdMgr.execute(cmd3);
  const now = cmdMgr.top();
  expect(now).toBe(cmd3);
});

test('undo cmd32 should now be cmd1', () => {
  const cmdMgr = new CommandStack();
  cmdMgr.execute(cmd1);
  cmdMgr.execute(cmd2);
  cmdMgr.execute(cmd3);
  cmdMgr.undo();
  cmdMgr.undo();
  const now = cmdMgr.top();
  expect(now).toBe(cmd1);
});

test('redo cmd2 should now be cmd2', () => {
  const cmdMgr = new CommandStack();
  cmdMgr.execute(cmd1);
  cmdMgr.execute(cmd2);
  cmdMgr.execute(cmd3);
  cmdMgr.undo();
  cmdMgr.undo();
  cmdMgr.redo();
  const now = cmdMgr.top();
  expect(now).toBe(cmd2);
});

test('exec cmd4 should clear dirty command(cmd3)', () => {
  const cmdMgr = new CommandStack();
  cmdMgr.execute(cmd1);
  cmdMgr.execute(cmd2);
  cmdMgr.execute(cmd3);
  cmdMgr.undo();
  cmdMgr.undo();
  cmdMgr.redo();
  cmdMgr.execute(cmd4);
  expect(cmdMgr.size).toBe(3);
  const isDid = cmdMgr.redo(); // should not work here
  const now = cmdMgr.top();
  console.log(isDid);

  expect(now).toBe(cmd4);
  expect(isDid).toBeFalsy();
});

test('undo shold not work when history is empty', () => {
  const cmdMgr = new CommandStack();
  const isDid = cmdMgr.undo();
  expect(isDid).toBeFalsy();
});
