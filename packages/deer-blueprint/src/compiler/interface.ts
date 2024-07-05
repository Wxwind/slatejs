import { BPNode } from '@/interface';

export interface CompilerContext {
  currentNode: BPNode;
  getInputValue: (pinName: string) => string;
  getOutputExec: (pinName: string) => string;
  getOutputVarName: (pinName: string) => string;
}
