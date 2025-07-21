碰撞体编辑器和组件的交互通过发送事件进行，定义如下:

```
export type EventMap = {
  OnColliderUpdated: [id: string, config: ColliderConfig];
  OnColliderCreated: [config: ColliderConfig];
  OnColliderDragEnd: [id: string, config: ColliderConfig];
};
```

1. OnColliderUpdated: Triggered when use ColliderEditTool to edit collider
2. OnColliderCreated: Triggered when use ColliderCreator to create collider
3. OnColliderDragEnd: 使用ColliderEditTool的ColliderObjSelectManager拖动碰撞体结束后触发
