import { Euler, EulerOrder, Matrix4, Object3D, Quaternion, Vector3 } from 'three';

export class TransformUtils {
  static worldToLocalPosition(object: Object3D, worldPosition: Vector3) {
    if (object.parent === null) {
      return worldPosition;
    } else {
      const localPosition = object.parent.worldToLocal(worldPosition.clone());
      return localPosition;
    }
  }

  static localToWorldPosition(object: Object3D, position: Vector3) {
    if (object.parent === null) {
      return position;
    } else {
      const localPosition = object.parent.localToWorld(position.clone());
      return localPosition;
    }
  }

  static worldToLocalRotation(obj: Object3D, quaternion: Quaternion) {
    // 如果对象没有父对象，则世界旋转即为局部旋转
    if (obj.parent === null) {
      return quaternion.clone();
    }

    // 确保父对象的世界矩阵已更新
    obj.parent.updateWorldMatrix(true, false);

    // 获取父对象的世界旋转四元数
    const parentWorldQuaternion = new Quaternion();
    obj.parent.matrixWorld.decompose(new Vector3(), parentWorldQuaternion, new Vector3());

    // 计算父对象世界旋转的逆
    const inverseParentQuaternion = parentWorldQuaternion.clone().invert();

    // 计算局部旋转：局部旋转 = 父逆旋转 × 目标世界旋转
    return inverseParentQuaternion.multiply(quaternion);
  }

  static localToWorldRotation(obj: Object3D, quaternion: Quaternion) {
    // 如果对象没有父对象，则局部旋转就是世界旋转
    if (obj.parent === null) {
      return quaternion.clone();
    }

    // 获取父对象的世界旋转
    obj.parent.updateWorldMatrix(true, false);
    const parentWorldQuaternion = new Quaternion();
    obj.parent.matrixWorld.decompose(new Vector3(), parentWorldQuaternion, new Vector3());

    // 计算世界旋转：世界旋转 = 父对象的世界旋转 × 局部旋转
    return parentWorldQuaternion.clone().multiply(quaternion);
  }

  static setWorldPosition(object: Object3D, worldPosition: Vector3) {
    if (object.parent === null) {
      object.position.copy(worldPosition);
    } else {
      const localPosition = object.parent.worldToLocal(worldPosition.clone());
      object.position.copy(localPosition);
    }
  }

  static setWorldQuaternion(object: Object3D, worldQuaternion: Quaternion) {
    if (object.parent === null) {
      object.quaternion.copy(worldQuaternion);
    } else {
      const parentQuaternion = new Quaternion();
      object.parent.getWorldQuaternion(parentQuaternion);
      object.quaternion.copy(worldQuaternion.multiply(parentQuaternion.invert()));
    }
  }

  static setWorldEuler(object: Object3D, worldEuler: Euler) {
    const worldQuaternion = new Quaternion();
    worldQuaternion.setFromEuler(worldEuler);

    if (object.parent === null) {
      object.quaternion.copy(worldQuaternion);
    } else {
      const parentQuaternion = new Quaternion();
      object.parent.getWorldQuaternion(parentQuaternion);
      object.quaternion.copy(worldQuaternion.premultiply(parentQuaternion.invert()));
    }
  }

  static getWorldEuler(object: Object3D, order: EulerOrder = 'XYZ') {
    const worldQuaternion = new Quaternion();
    object.getWorldQuaternion(worldQuaternion);
    return new Euler().setFromQuaternion(worldQuaternion, order);
  }

  static getWorldScale(object: Object3D, out: Vector3) {
    // 确保世界矩阵已更新
    object.updateWorldMatrix(true, true);

    // 创建临时变量接收分解结果
    const position = new Vector3();
    const quaternion = new Quaternion();

    // 分解世界矩阵 (scale即为世界缩放)
    object.matrixWorld.decompose(position, quaternion, out);

    return out;
  }

  /**
   * 通过世界变换矩阵设置对象的position、quaternion、scale
   * @param object
   * @param worldMatrix
   */
  static setWorldMatrix(object: Object3D, worldMatrix: Matrix4): void {
    if (object.parent) {
      const parentWorldMatrixInverse = new Matrix4();
      parentWorldMatrixInverse.copy(object.parent.matrixWorld).invert();

      const localMatrix = new Matrix4();
      localMatrix.multiplyMatrices(parentWorldMatrixInverse, worldMatrix);

      const position = new Vector3();
      const quaternion = new Quaternion();
      const scale = new Vector3();
      localMatrix.decompose(position, quaternion, scale);

      object.position.copy(position);
      object.quaternion.copy(quaternion);
      object.scale.copy(scale);
    } else {
      const position = new Vector3();
      const quaternion = new Quaternion();
      const scale = new Vector3();
      worldMatrix.decompose(position, quaternion, scale);

      object.position.copy(position);
      object.quaternion.copy(quaternion);
      object.scale.copy(scale);
    }

    object.updateMatrix();
    object.updateMatrixWorld();
  }
}
