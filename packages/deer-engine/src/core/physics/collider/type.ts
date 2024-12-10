import { IVector3 } from '@/type';

export type BoxColliderConfig = {
  type: 'Box';
  size: IVector3;
  position: IVector3;
  rotation: IVector3;
};

export type CapsuleColliderConfig = {
  type: 'Capsule';
  radius: number;
  height: number;
  position: IVector3;
  rotation: IVector3;
};

export type SphereColliderConfig = {
  type: 'Sphere';
  radius: number;
  position: IVector3;
  rotation: IVector3;
};

export type PlaneColliderConfig = {
  type: 'Plane';
  position: IVector3;
  rotation: IVector3;
};
