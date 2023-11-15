import { Object3D } from 'three';
import { DeerScene } from '../DeerScene';
import { Entity } from '../entity';
import { TransformComponent } from '../component';
import { isNil } from '@/util';

export class EntityManager {
  private readonly entityMap = new Map<string, Entity>();
  private readonly entityArray: Entity[] = [];
  private readonly scene: DeerScene;

  constructor(scene: DeerScene) {
    this.scene = scene;
  }

  createEntity = (name: string, parent: TransformComponent | null | string) => {
    const p =
      typeof parent === 'string'
        ? this.getEntityById(parent)?.getComponentByType<TransformComponent>('Transform') || this.scene
        : isNil(parent)
        ? this.scene
        : parent;

    const e = new Entity(name, p);
    if (isNil(parent)) {
      this.scene.addChild(e.rootComp);
    }
    this.entityMap.set(e.id, e);
    this.entityArray.push(e);
    return e;
  };

  getEntityById = (id: string) => {
    return this.entityMap.get(id);
  };

  removeEntityById = (id: string) => {
    const index = this.entityArray.findIndex((a) => a.id === id);

    if (index === -1) {
      console.error(`component (compId = ${id}) not exist`);
      return;
    }

    const entity = this.entityArray[index];
    this.entityMap.delete(id);
    this.entityArray.splice(index, 1);
    entity.onDestory();
  };

  onDestory = () => {
    this.entityArray.forEach((a) => a.onDestory());
    this.entityMap.clear();
    this.entityArray.length = 0;
  };
}
