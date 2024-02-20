import { egclass, property } from '../data';
import { MeshComponent } from './MeshComponent';
import { TransformComponent } from './TransformComponent';

export type ComponentType = 'MeshComponent' | 'TransformComponent';

@egclass()
export class FVector2 {
  @property({ type: Number })
  x: number = 0;
  @property({ type: Number })
  y: number = 0;
}

@egclass()
export class FVector3 {
  @property({ type: Number })
  x: number = 0;
  @property({ type: Number })
  y: number = 0;
  @property({ type: Number })
  z: number = 0;
}

@egclass()
export class FVector4 {
  @property({ type: Number })
  x: number = 0;
  @property({ type: Number })
  y: number = 0;
  @property({ type: Number })
  z: number = 0;
  @property({ type: Number })
  w: number = 0;
}

export type MeshCompJson = {
  count: number;
};

export type TransformCompJson = {
  position: FVector3;
  rotation: FVector3;
  scale: FVector3;
};

export type ComponentTypeToJsonObjMap = {
  MeshComponent: MeshCompJson;
  TransformComponent: TransformCompJson;
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
