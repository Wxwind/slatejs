import { CompilerContext } from '@/compiler/interface';
import Konva from 'konva';

export type BPNodeType = 'begin' | 'end' | 'function';

export interface BPNode {
  id: string;
  name: string;
  position: Konva.Vector2d;

  type: BPNodeType;
  inputs: BPPinDefinition[];
  outputs: BPPinDefinition[];

  width: number;
  label: string;
  category: string;
  output: (context: CompilerContext) => string;
}

export type StringToBaseType = {
  number: number;
  string: string;
  boolean: boolean;
};

export type BPPinDirection = 'in' | 'out';
export type BPPinType = 'exec' | 'data';
export type BPPinDataType = keyof StringToBaseType;

export type BPExecPinDefinition = {
  name: string;
  label?: string;
  type: 'exec';
};

export type BPDataPinDefinitionMap = {
  [key in keyof StringToBaseType]: {
    name: string;
    label?: string;
    type: 'data';

    dataType: key;
    defaultValue: StringToBaseType[key];
    value?: StringToBaseType[key];
  };
};

export type BPDataPinDefinition = BPDataPinDefinitionMap[BPPinDataType];

export type BPPinDefinition = BPExecPinDefinition | BPDataPinDefinition;
