import { CommandType } from '@/core';
import { PromiseAble } from './type';

export interface ICommand {
  type: CommandType;
  execute: (isRedo: boolean) => PromiseAble<void>;

  undo: () => PromiseAble<void>;

  toString: () => string;
}
