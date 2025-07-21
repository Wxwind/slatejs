import { Component, IVector2, DeerScene, THREE, Entity } from 'deer-engine';

/**
 * 将v向量分解成u1和u2
 * @param v 待分解的向量
 * @param u1 单位向量1
 * @param u2 单位向量2
 * @returns [单位向量1的系数，单位向量2的系数]
 */
export function decomposeVector(v: IVector2, u1: IVector2, u2: IVector2): [u1: number, u2: number] {
  const det = u1.x * u2.y - u1.y * u2.x;
  // 是奇异矩阵
  if (Math.abs(det) < 1e-6) {
    const length = Math.hypot(v.x, v.y);
    return [length, length];
  }
  // 克拉默法则
  const a = (v.x * u2.y - v.y * u2.x) / det;
  const b = (v.y * u1.x - v.x * u1.y) / det;
  return [a, b];
}

const _box3 = new THREE.Box3();
const _box3Size = new THREE.Vector3();
const _box3Center = new THREE.Vector3();

export function getAABBInfo(obj: THREE.Object3D) {
  const aabb = _box3.setFromObject(obj);
  return {
    size: aabb.getSize(_box3Size),
    center: aabb.getCenter(_box3Center),
    min: aabb.min,
    max: aabb.max,
  };
}

export function getScreenPos(ndcVector: THREE.Vector3) {
  const screenX = (ndcVector.x * 0.5 + 0.5) * window.innerWidth;
  const screenY = (-ndcVector.y * 0.5 + 0.5) * window.innerHeight;
  return new THREE.Vector2(screenX, screenY);
}

export function abs(vec: THREE.Vector3): THREE.Vector3 {
  vec.x = Math.abs(vec.x);
  vec.y = Math.abs(vec.y);
  vec.z = Math.abs(vec.z);

  return vec;
}

export function findLineIntersection3D(
  p1: THREE.Vector3,
  p2: THREE.Vector3,
  p3: THREE.Vector3,
  p4: THREE.Vector3,
  threshold = 1e-6
): THREE.Vector3 | null {
  const V1 = new THREE.Vector3().subVectors(p2, p1); // 直线1方向向量
  const V2 = new THREE.Vector3().subVectors(p4, p3); // 直线2方向向量
  const d = new THREE.Vector3().subVectors(p3, p1); // p3 - p1

  // 计算方向向量叉积
  const N = new THREE.Vector3().crossVectors(V1, V2);
  const lenN = N.length();

  // 处理平行或重合（方向向量平行）
  if (lenN < threshold) {
    const V1CrossD = new THREE.Vector3().crossVectors(V1, d);
    if (V1CrossD.length() < threshold) {
      return p1.clone(); // 重合，返回任意点
    }
    return null; // 平行无交点
  }

  // 检查是否异面（不共面）
  const mixProduct = Math.abs(N.dot(d));
  if (mixProduct > threshold) {
    return null; // 异面无交点
  }

  // 共面情况下求解交点
  const nAbs = new THREE.Vector3(Math.abs(N.x), Math.abs(N.y), Math.abs(N.z));
  let t = 0;

  if (nAbs.x >= nAbs.y && nAbs.x >= nAbs.z) {
    // 最大分量 |N.x|，用 y,z 分量计算
    t = (d.y * V2.z - d.z * V2.y) / N.x;
  } else if (nAbs.y >= nAbs.x && nAbs.y >= nAbs.z) {
    // 最大分量 |N.y|，用 x,z 分量计算
    t = (d.z * V2.x - d.x * V2.z) / N.y;
  } else {
    // 最大分量 |N.z|，用 x,y 分量计算
    t = (d.x * V2.y - d.y * V2.x) / N.z;
  }

  // 计算交点坐标
  const intersection = new THREE.Vector3().copy(p1).addScaledVector(V1, t);
  return intersection;
}

export function findLineIntersection2D(
  p1: THREE.Vector2,
  p2: THREE.Vector2,
  p3: THREE.Vector2,
  p4: THREE.Vector2,
  threshold = 1e-6
) {
  // 计算方向向量
  const dx1 = p2.x - p1.x;
  const dy1 = p2.y - p1.y;
  const dx2 = p4.x - p3.x;
  const dy2 = p4.y - p3.y;

  // 计算叉积，用于判断是否平行
  const cross = dx1 * dy2 - dx2 * dy1;
  // 计算向量AC
  const acx = p3.x - p1.x;
  const acy = p3.y - p1.y;

  // 如果叉积（行列式的绝对值）小于阈值，则两直线平行或重合
  if (Math.abs(cross) < threshold) {
    // 计算向量AC与方向向量V1的叉积，判断是否共线
    const crossAC = dx1 * acy - dy1 * acx;
    if (Math.abs(crossAC) < threshold) {
      // 重合，返回任意点，这里返回A
      return { x: p1.x, y: p1.y };
    }
    // 平行无交点
    return null;
  }

  // 计算参数t：使用克莱姆法则，解方程组
  // 方程：t = (acx*dy2 - acy*dx2) / cross
  const t = (acx * dy2 - acy * dx2) / cross;

  // 计算交点
  const x = p1.x + t * dx1;
  const y = p1.y + t * dy1;

  return new THREE.Vector2(x, y);
}

function flatEntities<T extends { children: T[] }>(root: T[], res: T[]) {
  for (const child of root) {
    res.push(child);
    flatEntities(child.children, res);
  }
}

function getActiveComponents(scene: DeerScene): Entity[] {
  const result: Entity[] = [];
  flatEntities<Entity>(scene._rootEntities, result);

  return result.filter((c) => c._activeInScene);
}

function sortIntersects(intersects: Array<THREE.Intersection>): Array<THREE.Intersection> {
  return intersects.sort((a, b) => a.distance - b.distance);
}

export function intersectObject(ev: MouseEvent, rayCaster: THREE.Raycaster, scene: DeerScene) {
  const intersects = getActiveComponents(scene).flatMap((entity) =>
    entity.intersectObject(rayCaster, ev).map(
      (intersection): THREE.Intersection => ({
        ...intersection,
        component: entity,
      })
    )
  );

  return sortIntersects(intersects);
}
