import { DeerEngine } from '@/core';
import { DisorderedArray } from '@/core/DisorderedMap';
import { Keys } from './enums/Keys';
import { IInput } from './interface/IInput';
import { Platform, SystemInfo } from '@/core/SystemInfo';

export class KeyboardManager implements IInput {
  /** Whether the key is held down in current frame. index is key's code, value indicates the order of the held-down key */
  _curHeldDownKeyToIndexMap: (number | undefined)[] = [];
  /** index is key's code, value indicates the frame time when the key up */
  _upKeyToFrameCountMap: number[] = [];
  /** index is key's code, value indicates the frame time when the key down */
  _downKeyToFrameCountMap: number[] = [];

  /** held down key in current frame */
  _curFrameHeldDownList: DisorderedArray<Keys> = new DisorderedArray();
  /** down key in current frame */
  _curFrameDownList: DisorderedArray<Keys> = new DisorderedArray();
  /** up key in current frame */
  _curFrameUpList: DisorderedArray<Keys> = new DisorderedArray();

  private _nativeEvents: KeyboardEvent[] = [];

  constructor(
    private _engine: DeerEngine,
    /** the dom element to listen */
    private _target: EventTarget
  ) {
    this.onBlur = this.onBlur.bind(this);
    this.onKeyEvent = this.onKeyEvent.bind(this);
    this.addEventListener();
  }

  _update() {
    const { _nativeEvents, _curFrameDownList, _curFrameUpList } = this;
    _curFrameDownList.length = 0;
    _curFrameUpList.length = 0;
    if (_nativeEvents.length > 0) {
      const frameCount = this._engine.time.frameCount;
      const { _curHeldDownKeyToIndexMap, _curFrameHeldDownList, _downKeyToFrameCountMap, _upKeyToFrameCountMap } = this;

      for (const evt of _nativeEvents) {
        const codeKey = Keys[evt.code as keyof typeof Keys] as Keys;
        switch (evt.type) {
          case 'keydown':
            // avoid repeat trigger
            if (_curHeldDownKeyToIndexMap[codeKey] === undefined) {
              _curFrameDownList.add(codeKey);
              _curFrameHeldDownList.add(codeKey);
              _curHeldDownKeyToIndexMap[codeKey] = _curFrameHeldDownList.length - 1;
              _downKeyToFrameCountMap[codeKey] = frameCount;
            }
            break;

          case 'keyup': {
            const index = _curHeldDownKeyToIndexMap[codeKey];
            if (index !== undefined) {
              _curHeldDownKeyToIndexMap[codeKey] = undefined;
              const swapCode = _curFrameHeldDownList.deleteByIndex(index);

              // FIXME: the order differs from real held down order.
              swapCode && (_curHeldDownKeyToIndexMap[swapCode] = index);
            }
            _curFrameUpList.add(codeKey);
            _upKeyToFrameCountMap[codeKey] = frameCount;

            // Because on the mac, the keyup event is not responded to when the meta key is held down,
            // in order to maintain the correct keystroke record, it is necessary to clear the record
            // when the meta key is lifted.
            // link: https://stackoverflow.com/questions/11818637/why-does-javascript-drop-keyup-events-when-the-metakey-is-pressed-on-mac-browser
            if (SystemInfo.platform === Platform.Mac && (codeKey === Keys.MetaLeft || codeKey === Keys.MetaRight)) {
              for (let i = 0, n = _curFrameHeldDownList.length; i < n; i++) {
                _curHeldDownKeyToIndexMap[_curFrameHeldDownList.get(i)] = undefined;
              }
              _curFrameHeldDownList.length = 0;
            }
            break;
          }

          default:
            break;
        }
      }

      _nativeEvents.length = 0;
    }
  }

  _destroy() {
    this.removeEventListener();
    this._curHeldDownKeyToIndexMap.length = 0;
    this._upKeyToFrameCountMap.length = 0;
    this._downKeyToFrameCountMap.length = 0;
    this._nativeEvents.length = 0;
    this._curFrameHeldDownList.length = 0;
    this._curFrameDownList.length = 0;
    this._curFrameUpList.length = 0;
  }

  private onBlur() {
    this._curHeldDownKeyToIndexMap.length = 0;
    this._curFrameHeldDownList.length = 0;
    this._curFrameDownList.length = 0;
    this._curFrameUpList.length = 0;
    this._nativeEvents.length = 0;
  }

  private onKeyEvent(nativeEvt: Event) {
    this._nativeEvents.push(nativeEvt as KeyboardEvent);
  }

  private addEventListener() {
    const target = this._target;
    target.addEventListener('blur', this.onBlur);
    target.addEventListener('keydown', this.onKeyEvent);
    target.addEventListener('keyup', this.onKeyEvent);
  }

  private removeEventListener() {
    const target = this._target;
    target.removeEventListener('blur', this.onBlur);
    target.removeEventListener('keydown', this.onKeyEvent);
    target.removeEventListener('keyup', this.onKeyEvent);
  }
}
