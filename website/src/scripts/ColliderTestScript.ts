import { Collider, Script } from 'deer-engine';

export class ColliderTestScript extends Script {
  override onCollisionEnter(other: Collider): void {
    console.log('collider enter', other, other._rigidbody?.entity.name);
  }

  override onCollisionStay(other: Collider): void {
    console.log('collider stay', other, other._rigidbody?.entity.name);
  }

  override onCollisionExit(other: Collider): void {
    console.log('collider exit', other, other._rigidbody?.entity.name);
  }
}
