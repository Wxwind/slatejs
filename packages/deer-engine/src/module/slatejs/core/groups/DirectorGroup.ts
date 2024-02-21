import { Entity, egclass } from '@/core';
import { CutsceneGroup } from '../CutsceneGroup';
import { Cutscene } from '../Cutscene';
import { AnimationTrack } from '../tracks/AnimationTrack';
import { genUUID } from '@/util';
import { CutsceneGroupData } from '../type';

@egclass()
export class DirectorGroup extends CutsceneGroup {
  protected _actor: Entity | undefined;

  get name(): string {
    return this._actor?.name || '';
  }

  static constructFromJson(director: Cutscene, data: CutsceneGroupData) {
    const group = new DirectorGroup(director, data.id, []);
    data.children.forEach((t) => {
      const track = AnimationTrack.constructFromJson(group, t);
      group._tracks.push(track);
    });
    return group;
  }

  static construct(parent: Cutscene) {
    const group = new DirectorGroup(parent, genUUID('csg'), []);
    return group;
  }

  enter: () => void = () => {};
}
