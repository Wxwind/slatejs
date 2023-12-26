import { genUUID } from '@/util';
import { ActionClipData, ActionClipTypeToKeyMap, CreateActionClipDto, UpdateActionClipDto } from '../type';
import { ActionClipBase } from '../ActionClip';
import { IDirectable } from '../IDirectable';
import { CutsceneTrack } from '../CutsceneTrack';
import { AnimatedParameterCollection } from '../AnimatedParameterCollection';

export class TransformClip extends ActionClipBase<'Transform'> {
  protected _type = 'Transform' as const;

  data: ActionClipData<'Transform'>;

  private _animatedParams: AnimatedParameterCollection;

  private constructor(parent: IDirectable, data: ActionClipData<'Transform'>) {
    super(parent);
    this.data = data;
    this._animatedParams = new AnimatedParameterCollection();
  }

  static construct(parent: CutsceneTrack, { name, start, end, keys }: CreateActionClipDto<'Transform'>) {
    const id = genUUID();
    return new TransformClip(parent, { id, type: 'Transform', name, start, end, keys });
  }

  updateData: (data: UpdateActionClipDto<'Transform'>) => void = (data) => {
    this.data = { ...this.data, ...data };
  };

  addKey: (key: ActionClipTypeToKeyMap['Transform']) => void = (key) => {
    this.data.keys.push(key);
  };

  updateKeys: (keyId: string, keyData: ActionClipTypeToKeyMap['Transform']) => void = (keyId, keyData) => {
    const keyIndex = this.data.keys.findIndex((a) => a.id === keyId);
    if (keyIndex === -1) {
      console.error(`key(id = ${keyId}) not exists`);
      return;
    }
    this.data.keys[keyIndex] = { ...this.data.keys[keyIndex], ...keyData };
  };

  removeKey: (keyId: string) => void = (keyId) => {
    const keyIndex = this.data.keys.findIndex((a) => a.id === keyId);
    if (keyIndex === -1) {
      console.error(`key(id = ${keyId}) not exists`);
      return;
    }
    this.data.keys.splice(keyIndex, 1);
  };
}
