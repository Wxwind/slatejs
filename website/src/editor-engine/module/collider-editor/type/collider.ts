import { IVector3 } from 'deer-engine';

export type ColliderConfig = (
  | BoxColliderConfig
  | CapsuleColliderConfig
  | SphereColliderConfig
  | PlaneColliderConfig
) & {
  id: string;
  name: string;
};

export type BoxColliderConfig = {
  type: 'Box';
  size: IVector3;
  position: IVector3;
  rotation: IVector3;
  isTrigger: boolean;
};

export type CapsuleColliderConfig = {
  type: 'Capsule';
  radius: number;
  height: number;
  position: IVector3;
  rotation: IVector3;
  isTrigger: boolean;
};

export type SphereColliderConfig = {
  type: 'Sphere';
  radius: number;
  position: IVector3;
  rotation: IVector3;
  isTrigger: boolean;
};

export type PlaneColliderConfig = {
  type: 'Plane';
  position: IVector3;
  rotation: IVector3;
  isTrigger: boolean;
};

export type EventMap = {
  OnColliderUpdated: [id: string, config: ColliderConfig];
  OnColliderCreated: [config: ColliderConfig];
  OnColliderDragEnd: [id: string, config: ColliderConfig];
};
