import { MeshComponent } from './MeshComponent';
import { TransformComponent } from './TransformComponent';

export type ComponentType = 'Mesh' | 'Transform';

export type Vector3 = {
  x: number;
  y: number;
  z: number;
};

export type MeshCompJson = {
  count: number;
};

export type TransformCompJson = {
  position: Vector3;
  rotation: Vector3;
  scale: Vector3;
};

export type ComponentTypeToJsonObjMap = {
  Mesh: MeshCompJson;
  Transform: TransformCompJson;
};

export type ComponentInfoMap = {
  [K in keyof ComponentTypeToJsonObjMap]: {
    id: string;
    type: K;
    config: ComponentTypeToJsonObjMap[K];
  };
};

export type ComponentInfo = ComponentInfoMap[keyof ComponentTypeToJsonObjMap];

export type Component = MeshComponent | TransformComponent;
export type ComponentJson = MeshCompJson | TransformCompJson;
