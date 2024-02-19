import { Entity, egclass } from '@/core';
import { CutsceneGroup } from '../CutsceneGroup';
import { CutsceneGroupData } from '../type';
import { TransformTrack } from '../tracks/TransformTrack';
import { Cutscene } from '../Cutscene';
import { genUUID } from '@/util';

@egclass()
export class ActorGroup extends CutsceneGroup {
  protected _actor: Entity | undefined;

  get name(): string {
    return this._actor?.name || '';
  }

  static constructFromJson(director: Cutscene, data: CutsceneGroupData) {
    const group = new ActorGroup(director, data.id, []);
    data.children.forEach((t) => {
      const track = TransformTrack.constructFromJson(group, t);
      group._tracks.push(track);
    });
    return group;
  }

  static construct(parent: Cutscene) {
    const group = new ActorGroup(parent, genUUID('csg'), []);
    return group;
  }

  enter: () => void = () => {};
}
