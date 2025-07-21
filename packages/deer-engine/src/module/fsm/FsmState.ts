import { Fsm } from './Fsm';

export abstract class FsmState<T = unknown> {
  onInit(fsm: Fsm<T>): void {}
  onEnter(fsm: Fsm<T>): void {}
  onUpdate(fsm: Fsm<T>, dt: number): void {}
  onLeave(fsm: Fsm<T>): void {}
  onDestroy(fsm: Fsm<T>): void {}
}
