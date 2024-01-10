import { MeshComponent } from './MeshComponent';
import { TransformComponent } from './TransformComponent';

export type ComponentType = 'Mesh' | 'Transform';

export type IVector2 = {
  x: number;
  y: number;
};

export class IVector3 {
  x: number = 0;
  y: number = 0;
  z: number = 0;
}

export type IVector4 = {
  x: number;
  y: number;
  z: number;
  w: number;
};

export type MeshCompJson = {
  count: number;
};

export type TransformCompJson = {
  position: IVector3;
  rotation: IVector3;
  scale: IVector3;
};

export type ComponentTypeToJsonObjMap = {
  Mesh: MeshCompJson;
  Transform: TransformCompJson;
};

type ComponentDataMap = {
  [K in ComponentType]: {
    id: string;
    type: K;
    config: ComponentTypeToJsonObjMap[K];
  };
};

export type ComponentData<T extends ComponentType = ComponentType> = ComponentDataMap[T];

export type Component = MeshComponent | TransformComponent;
export type ComponentJson = MeshCompJson | TransformCompJson;
