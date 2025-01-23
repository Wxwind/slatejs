import { Collider, ControllerColliderHit, Script } from 'deer-engine';

export class CollEventTestScript extends Script {
  override onCollisionEnter(other: Collider): void {
    console.log(`${this.entity.name} onCollisionEnter: ${other._rigidbody?.entity.name}`);
  }

  override onCollisionExit(other: Collider): void {
    console.log(`${this.entity.name} onCollisionExit: ${other._rigidbody?.entity.name}`);
  }

  override onTriggerEnter(other: Collider): void {
    console.log(`${this.entity.name} onTriggerEnter: ${other._rigidbody?.entity.name}`);
  }

  override onTriggerExit(other: Collider): void {
    console.log(`${this.entity.name} onTriggerExit: ${other._rigidbody?.entity.name}`);
  }

  override onControllerColliderHit(hit: ControllerColliderHit): void {
    console.log(`${this.entity.name} onControllerColliderHit: ${hit.collider.rigidbody.entity.name}`);
  }
}
