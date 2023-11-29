import { ActionClip, IDirectable } from '..';
import { genUUID } from '@/util';
import { ActionClipData, ClipType } from '../type';

export class TransformClip extends ActionClip {
  data: TransformClipData;

  get type(): ClipType {
    return 'Animation';
  }

  constructor(parent: IDirectable, data: TransformClipData) {
    super(parent);
    this.data = data;
  }

  static construct(parent: IDirectable, name: string, start: number, end: number, layerId: string) {
    const id = genUUID();
    return new TransformClip(parent, { id, name, start, end, layerId });
  }
}

export interface TransformClipData extends ActionClipData {}

export type UpdateTransformClipDataDto = Partial<Omit<TransformClipData, 'id'>>;
