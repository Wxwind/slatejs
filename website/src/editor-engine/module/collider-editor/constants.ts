import { THREE } from 'deer-engine';

export const ControlPointColors = {
  Normal: 0xffffff,
  Selected: 0xffff00,
};

export const meshMaterialSettings: THREE.MeshPhongMaterialParameters = {
  color: 0xff0000,
  opacity: 0.2,
  transparent: true,
  depthTest: true,
  depthWrite: false,
};
