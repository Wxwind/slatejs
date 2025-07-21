import { Blackboard } from './Blackboard';
import { FsmState } from './FsmState';

export class Fsm<T = any> {
  private _owner: T;
  public get owner(): T {
    return this._owner;
  }

  private _isRunning: boolean = false;
  public get isRunning(): boolean {
    return this._isRunning;
  }

  private _isDestroyed: boolean = false;
  public get isDestroyed(): boolean {
    return this._isDestroyed;
  }

  private _stateMap = new Map<new () => FsmState<T>, FsmState<T>>();

  private _curState: FsmState<T> | null = null;

  private _blackboard = new Blackboard();

  private _curStateRunningTime: number = 0;

  get curStateRunningTime() {
    return this._curStateRunningTime;
  }

  get fsmStatesCount() {
    return this._stateMap.size;
  }

  constructor(owner: T, stateList: FsmState<T>[]) {
    this._owner = owner;

    for (const state of stateList) {
      if (this._stateMap.has(state.constructor as new () => FsmState<T>)) {
        throw new Error(`fsm ${state.constructor.name} is already exist`);
      }
      this._stateMap.set(state.constructor as new () => FsmState<T>, state);
      state.onInit(this);
    }
  }

  getData<T>(key: string) {
    return this._blackboard.getValue<T>(key);
  }

  setData(key: string, value: any) {
    return this._blackboard.setValue(key, value);
  }

  removeData(key: string) {
    return this._blackboard.removeValue(key);
  }

  hasState(stateType: new () => FsmState<T>): boolean {
    return this._stateMap.has(stateType);
  }

  getState(stateType: new () => FsmState<T>): FsmState<T> | null {
    return this._stateMap.get(stateType) || null;
  }

  start(stateType: new () => FsmState<T>): void {
    if (this._isRunning) {
      throw new Error("fsm is running, can't start again");
    }
    const state = this.getState(stateType);
    if (!state) {
      throw new Error(`state is missing: ${stateType.name}`);
    }
    this._curStateRunningTime = 0;
    this._curState = state;
    this._curState.onEnter(this);

    this._isRunning = true;
  }

  update(dt: number): void {
    if (!this._isRunning || !this._curState) return;
    this._curStateRunningTime += dt;
    this._curState.onUpdate(this, dt);
  }

  switchState(stateType: new () => FsmState<T>): void {
    if (this._curState === null) {
      throw new Error('');
    }
    const state = this.getState(stateType);
    if (state === null) {
      throw new Error(`state is missing: ${stateType.name}`);
    }
    this._curState.onLeave(this);
    this._curStateRunningTime = 0;
    this._curState = state;
    state.onEnter(this);
  }

  destroy(): void {
    if (this._curState !== null) {
      this._curState.onLeave(this);
    }
    for (const state of this._stateMap.values()) {
      state.onDestroy(this);
    }

    this._stateMap.clear();
    this._blackboard.clear();
    this._curState = null;
    this._curStateRunningTime = 0;
    this._isDestroyed = true;
    this._isRunning = false;
  }
}
