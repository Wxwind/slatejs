import { CommandType } from '@/core';

export interface ICommand {
  type: CommandType;
  execute: () => void;

  undo: () => void;

  toString: () => string;
}
