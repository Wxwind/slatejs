import { CommandId } from '@/core';

export interface ICommand {
  id: CommandId;
  execute: () => void;

  undo: () => void;

  toString: () => string;
}
