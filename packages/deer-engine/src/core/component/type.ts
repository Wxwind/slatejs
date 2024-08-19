import { egclass, property } from '../decorator';
import { CameraComponent } from './scene/CameraComponent';
import { MeshComponent } from './MeshComponent';
import { TransformComponent } from './TransformComponent';
import { RendererComponent } from './scene';
import { ViewHelperComponent } from './scene/ViewHelperComponent';
import { ControlComponent } from './scene/ControlComponent';
import { GridHelper } from 'three';
import { GridHelperComponent } from './scene/GridHelperComponent';

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

export type MeshComponentJson = {
  count: number;
};

export type TransformComponentJson = {
  position: FVector3;
  rotation: FVector3;
  scale: FVector3;
};

export type CameraComponentJson = {
  position: FVector3;
  rotation: FVector3;
  scale: FVector3;
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
  ViewHelperComponent: ViewHelperComponentJson;
  ControlComponent: ControlComponentJson;
  GridHelperComponent: GridHelperComponentJson;
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
  | RendererComponent
  | ViewHelperComponent
  | ControlComponent
  | GridHelperComponent;

export type ComponentData<T extends ComponentType = ComponentType> = ComponentDataMap[T];
export type ComponentJson<T extends ComponentType = ComponentType> = ComponentTypeToJsonObjMap[T];
