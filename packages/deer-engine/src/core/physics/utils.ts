import { DynamicRigidbodyComponent } from './DynamicRigidbodyComponent';
import { RigidbodyComponent } from './RigidbodyComponent';

export function isDynamicRigidBody(rigidbody: RigidbodyComponent): boolean {
  return rigidbody instanceof DynamicRigidbodyComponent && !rigidbody.isKinematic;
}
