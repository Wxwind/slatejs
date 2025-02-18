import { IVector3 } from '@/type';
import { Entity } from '../entity';
import { Collider } from './collider';
import { Vector3 } from 'three';

export class HitResult {
  /** entity that wat hit */
  entity: Entity | null = null;
  /** distance from raycast origin to hit point */
  distance: number = 0;
  /** point of raycast hit */
  point: Vector3 = new Vector3();
  /** normal of raycast hit */
  normal: Vector3 = new Vector3();
  /** collider that was hit */
  collider: Collider | null = null;
}
