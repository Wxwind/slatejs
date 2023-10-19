import { ResourceClipBase } from './ResourceClipBase';

export class AnimationClip extends ResourceClipBase {
  private start: number;
  private end: number;
  private id: string;
  private layerId: string;
  private name: string;

  constructor(data: AnimationJson) {
    super();
    this.start = data.start;
    this.end = data.end;
    this.id = data.id;
    this.layerId = data.layerId;
    this.name = data.name;
  }

  serialize(): AnimationJson {
    return {
      start: this.start,
      end: this.end,
      id: this.id,
      layerId: this.layerId,
      name: this.name,
    };
  }
}

export type AnimationJson = {
  start: number;
  end: number;
  id: string;
  layerId: string;
  name: string;
};
