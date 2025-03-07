import { CommandStack, ICommand } from '../src/packages/command';
import { CommandType } from '../src/core/command';

export class EmptyCommand implements ICommand {
  constructor(private name: string) {}
  type: CommandType = 'CreateEntity';

  execute() {}
  undo() {}
  toString = () => {
    return `EmptyCommand: name = '${this.name}' `;
  };
}

const cmd1 = new EmptyCommand('step1');
const cmd2 = new EmptyCommand('step2');
const cmd3 = new EmptyCommand('step3');
const cmd4 = new EmptyCommand('step4');

test('exec cmd123', async () => {
  const cmdMgr = new CommandStack();
  await cmdMgr.execute(cmd1);
  await cmdMgr.execute(cmd2);
  await cmdMgr.execute(cmd3);
  const now = cmdMgr.top();
  expect(now).toBe(cmd3);
});

test('undo cmd32 should now be cmd1', async () => {
  const cmdMgr = new CommandStack();
  await cmdMgr.execute(cmd1);
  await cmdMgr.execute(cmd2);
  await cmdMgr.execute(cmd3);
  await cmdMgr.undo();
  await cmdMgr.undo();
  const now = cmdMgr.top();
  expect(now).toBe(cmd1);
});

test('redo cmd2 should now be cmd2', async () => {
  const cmdMgr = new CommandStack();
  await cmdMgr.execute(cmd1);
  await cmdMgr.execute(cmd2);
  await cmdMgr.execute(cmd3);
  await cmdMgr.undo();
  await cmdMgr.undo();
  await cmdMgr.redo();
  const now = cmdMgr.top();
  expect(now).toBe(cmd2);
});

test('exec cmd4 should clear dirty command(cmd3)', async () => {
  const cmdMgr = new CommandStack();
  await cmdMgr.execute(cmd1);
  await cmdMgr.execute(cmd2);
  await cmdMgr.execute(cmd3);
  await cmdMgr.undo();
  await cmdMgr.undo();
  await cmdMgr.redo();
  await cmdMgr.execute(cmd4);
  expect(cmdMgr.size).toBe(3);
  const redoCmd = await cmdMgr.redo(); // should not work here
  const now = cmdMgr.top();

  expect(now).toBe(cmd4);
  expect(redoCmd).toBeNull();
});

test('undo shold not work when history is empty', async () => {
  const cmdMgr = new CommandStack();
  const redoCmd = await cmdMgr.undo();
  expect(redoCmd).toBeFalsy();
});
