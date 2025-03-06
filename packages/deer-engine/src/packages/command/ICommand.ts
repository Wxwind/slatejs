import { CommandType } from '@/core';

export interface ICommand {
  type: CommandType;
  execute: (isRedo: boolean) => PromiseAble<void>;

  undo: () => PromiseAble<void>;

  toString: () => string;
}
