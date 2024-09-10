import * as THREE from 'three';
import { ComponentBase } from './ComponentBase';
import { isNil } from '@/util';
import { ModelComponentJson } from './type';
import { egclass } from '../decorator';
import { ResourceManager } from '../manager/AssetManager';

@egclass()
export class ModelComponent extends ComponentBase<'ModelComponent'> {
  type = 'ModelComponent' as const;

  private _model: THREE.Object3D | undefined;

  assetAddress: string = '<undefined>';
  private materials: THREE.Material[] = [];
  private geomatries: THREE.BufferGeometry[] = [];
  private animations: THREE.AnimationClip[] = [];

  private set model(value: THREE.Object3D | undefined) {
    this._model = value;
    if (!this._model) return;
    if (isNil(this.entity)) {
      console.warn('Model is created but owner is invalid, it will be dissociative');
      return;
    }
    this._entity.sceneObject.add(this._model);
  }

  private get model(): THREE.Object3D | undefined {
    return this._model;
  }

  public get isCanBeRemoved(): boolean {
    return true;
  }

  onAwake: () => void = async () => {
    const assetManager = this.engine.getManager(ResourceManager);
    const model = await assetManager.loadModelAsync(this.assetAddress);
    const materials: THREE.Material[] = [];
    const geometries: THREE.BufferGeometry[] = [];

    model?.traverse((node) => {
      if (node.type === 'SkinnedMesh' || model.type === 'Mesh') {
        const { material, geometry } = node as THREE.Mesh;
        Array.isArray(material) ? material.push(...material) : materials.push(material);
        geometries.push(geometry);
      }
    });
    this.materials = materials;
    this.geomatries = geometries;
    this.model = model;
    this.animations = model?.animations || [];
  };

  onEnabled: () => void = () => {};

  onDisabled: () => void = () => {};

  update: (dt: number) => void = () => {};

  onDestroy: () => void = () => {
    if (isNil(this.model)) {
      console.warn("mesh doesn't exist");
      return;
    }

    this.model.clear();
    this.materials.forEach((m) => m.dispose());
    this.geomatries.forEach((geo) => geo.dispose());
  };

  updateByJson: (data: ModelComponentJson, sync: boolean) => void = (data, sync) => {};

  onSerialize: () => ModelComponentJson = () => {
    // TODO
    return {
      assetAddress: this.assetAddress,
    };
  };

  onDeserialize: (data: ModelComponentJson) => void = (data) => {
    this.assetAddress = data.assetAddress;
  };
}
