export interface IObject {
  classType: new () => IObject; // 标志着所属的pool的key
  spawn: () => void; // 从Pool中取或者初始化时
  update: (deltaTime: number) => void;
  unSpawn: () => void; // 回收时需要清空属性
}
