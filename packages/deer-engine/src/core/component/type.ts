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
