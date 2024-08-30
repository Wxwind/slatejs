import * as THREE from 'three';
import { ComponentBase } from './ComponentBase';
import { isNil } from '@/util';
import { ModelComponentJson } from './type';
import { egclass } from '../decorator';
import { deerEngine } from '../DeerEngine';

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
    if (isNil(this.owner)) {
      console.warn('Model is created but owner is invalid, it will be dissociative');
      return;
    }
    this._owner.sceneObject.add(this._model);
  }

  private get model(): THREE.Object3D | undefined {
    return this._model;
  }

  public get isCanBeRemoved(): boolean {
    return true;
  }

  awake: () => void = async () => {
    const model = await deerEngine.assetManager.loadModelAsync(this.assetAddress);
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

  update: (dt: number) => void = () => {};

  destroy: () => void = () => {
    if (isNil(this.model)) {
      console.warn("mesh doesn't exist");
      return;
    }

    this.model.clear();
    this.materials.forEach((m) => m.dispose());
    this.geomatries.forEach((geo) => geo.dispose());
  };

  updateByJson: (data: ModelComponentJson) => void = (data) => {};

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
