import { DeerScene } from '../DeerScene';
import { Entity } from '../entity';
import { TransformComponent } from '../component';
import { isNil } from '@/util';
import { EntityForHierarchy } from '@/store/type';
import { Signal } from 'eventtool';

export class EntityManager {
  private readonly entityMap = new Map<string, Entity>();
  private readonly entityArray: Entity[] = [];
  private readonly scene: DeerScene;
  private _selectedEntity: Entity | undefined;

  signals = {
    entityTreeViewUpdated: new Signal(),
    entitySelected: new Signal(),
  };

  public get selectedEntity(): Entity | undefined {
    return this._selectedEntity;
  }

  private set selectedEntity(entity) {
    this._selectedEntity = entity;
    this.signals.entitySelected.emit();
  }

  constructor(scene: DeerScene) {
    this.scene = scene;
  }

  createEntity = (name: string, parent: TransformComponent | string | null | undefined) => {
    const p =
      typeof parent === 'string'
        ? this.findEntityById(parent)?.findComponentByType<TransformComponent>('TransformComponent') || this.scene
        : isNil(parent)
          ? this.scene
          : parent;

    const e = new Entity(name, p);
    if (isNil(parent)) {
      this.scene.addChild(e.rootComp);
    }
    this.entityMap.set(e.id, e);
    this.entityArray.push(e);

    this.signals.entityTreeViewUpdated.emit();
    return e;
  };

  findEntityById = (id: string) => {
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
    this.signals.entityTreeViewUpdated.emit();
  };

  onDestory = () => {
    this.entityArray.forEach((a) => a.onDestory());
    this.entityMap.clear();
    this.entityArray.length = 0;
  };

  private mapEntityForHierarchy: (entity: Entity | undefined) => EntityForHierarchy = (entity: Entity | undefined) => {
    if (isNil(entity)) return { id: '<missing>', name: '<missing>', children: [] };

    return {
      id: entity.id,
      name: entity.name,
      children: entity.rootComp.children.map((a) => {
        return this.mapEntityForHierarchy(a.entity);
      }),
    };
  };

  toTree: () => EntityForHierarchy[] = () => {
    const rootEntity = this.entityArray.filter((a) => a.rootComp.parent === this.scene);

    const tree: EntityForHierarchy[] = rootEntity.map(this.mapEntityForHierarchy);
    return tree;
  };

  select = (id: string | undefined) => {
    if (isNil(id)) {
      this.selectedEntity = undefined;
      return;
    }
    const selectEntity = this.findEntityById(id);
    this.selectedEntity = selectEntity;
  };
}
