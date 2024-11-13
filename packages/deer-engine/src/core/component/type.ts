import { CameraComponent } from './CameraComponent';
import { MeshComponent } from './MeshComponent';
import { ModelComponent } from './ModelComponent';
import { TransformComponent } from './TransformComponent';
import { StaticRigidbodyComponent } from '../physics/StaticRigidbodyComponent';
import { DynamicRigidbodyComponent } from '../physics/DynamicRigidbodyComponent';
import { IVector3 } from '@/type';

export type ModelComponentJson = {
  assetAddress: string;
};

export type MeshComponentJson = {
  type: 'Box' | 'Sphere';
};

export type TransformComponentJson = {
  position: IVector3;
  rotation: IVector3;
  scale: IVector3;
};

export type CameraComponentJson = {
  position: IVector3;
  rotation: IVector3;
  scale: IVector3;
  near: number;
  far: number;
  fov: number;
};

export type ControlComponentJson = Record<string, never>;

export type RendererComponentJson = Record<string, never>;

export type ViewHelperComponentJson = Record<string, never>;

export type GridHelperComponentJson = Record<string, never>;

export type ComponentTypeToJsonObjMap = {
  MeshComponent: MeshComponentJson;
  TransformComponent: TransformComponentJson;
  CameraComponent: CameraComponentJson;
  RendererComponent: RendererComponentJson;
  ModelComponent: ModelComponentJson;
  Script: any;
  StaticRigidbodyComponent: any;
  DynamicRigidbodyComponent: any;
};

type ComponentDataMap = {
  [K in ComponentType]: {
    id: string;
    type: K;
    config: ComponentTypeToJsonObjMap[K];
  };
};

export type ComponentType = keyof ComponentTypeToJsonObjMap;
export type Component =
  | MeshComponent
  | TransformComponent
  | CameraComponent
  | ModelComponent
  | StaticRigidbodyComponent
  | DynamicRigidbodyComponent;

export type ComponentData<T extends ComponentType = ComponentType> = ComponentDataMap[T];
export type ComponentJson<T extends ComponentType = ComponentType> = ComponentTypeToJsonObjMap[T];
