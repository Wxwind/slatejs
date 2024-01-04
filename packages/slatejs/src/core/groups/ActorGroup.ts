import { Entity } from 'deer-engine';
import { CutsceneGroup } from '../CutsceneGroup';
import { CutsceneGroupData } from '../type';
import { TransformTrack } from '../tracks/TransformTrack';
import { CutsceneDirector } from '../CutsceneDirector';
import { genUUID } from '@/util';

export class ActorGroup extends CutsceneGroup {
  protected _actor: Entity | undefined;

  get name(): string {
    return 'ActorGroup';
  }

  static constructFromJson(director: CutsceneDirector, data: CutsceneGroupData) {
    const group = new ActorGroup(director, data.id, []);
    data.children.forEach((t) => {
      const track = TransformTrack.constructFromJson(group, t);
      group._tracks.push(track);
    });
    return group;
  }

  static construct(parent: CutsceneDirector) {
    const group = new ActorGroup(parent, genUUID('csg'), []);
    return group;
  }

  onEnter: () => void = () => {};
}
