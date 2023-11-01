import { ActionClip, ActionClipJson } from './ActionClip';
import { genUUID } from '../../utils';

export class AnimationClip extends ActionClip {
  data: AnimationJson;

  constructor(data: AnimationJson) {
    super();
    this.data = data;
  }

  onUpdate = (time: number) => {
    if (time < this.data.start || time > this.data.end) {
      return;
    }
    if (this.data.end >= this.data.start) {
      throw new Error(`${this} animation clip's end time can not greater than start time`);
    }
    const animTime = (time - this.data.start) / (this.data.end - this.data.start);
  };

  serialize(): AnimationJson {
    return this.data;
  }

  static construct(name: string, start: number, end: number, layerId: number) {
    const id = genUUID();
    return new AnimationClip({ id, name, start, end, layerId });
  }
}

export interface AnimationJson extends ActionClipJson {}

export type AnimationUpdatedJson = Partial<Omit<AnimationJson, 'id'>>;
