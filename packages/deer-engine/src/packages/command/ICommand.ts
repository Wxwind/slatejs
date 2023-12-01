import { CommandType } from '@/core';

export interface ICommand {
  type: CommandType;
  execute: () => boolean;

  undo: () => boolean;

  toString: () => string;
}
