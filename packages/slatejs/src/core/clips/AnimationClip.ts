import { ActionClip, ActionClipJson, IDirectable } from '..';
import { genUUID } from '@/utils';

export class AnimationClip extends ActionClip {
  data: AnimationJson;

  constructor(parent: IDirectable, data: AnimationJson) {
    super(parent);
    this.data = data;
  }

  Enter: () => void = () => {};
  Exit: () => void = () => {};

  Update = (time: number) => {};

  serialize(): AnimationJson {
    return this.data;
  }

  static construct(parent: IDirectable, name: string, start: number, end: number, layerId: number) {
    const id = genUUID();
    return new AnimationClip(parent, { id, name, start, end, layerId });
  }
}

export interface AnimationJson extends ActionClipJson {}

export type AnimationUpdatedJson = Partial<Omit<AnimationJson, 'id'>>;
