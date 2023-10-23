import { v4 as uuid } from 'uuid';
import { ResourceClipBase, ResourceJson } from './ResourceClipBase';

export class AnimationClip extends ResourceClipBase {
  data: AnimationJson;

  constructor(data: AnimationJson) {
    super();
    this.data = data;
  }

  serialize(): AnimationJson {
    return this.data;
  }

  static construct(name: string, start: number, end: number, layerId: number) {
    const id = uuid();
    return new AnimationClip({ id, name, start, end, layerId });
  }
}

export interface AnimationJson extends ResourceJson {}

export type AnimationUpdatedJson = Partial<Omit<AnimationJson, 'id'>>;
