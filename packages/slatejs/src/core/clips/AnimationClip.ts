import { genUUID } from '@/util';
import { ActionClipData, ActionClipTypeToKeyMap, CreateActionClipDto, UpdateActionClipDto } from '../type';
import { ActionClipBase } from '../ActionClip';
import { IDirectable } from '../IDirectable';
import { CutsceneTrack } from '../CutsceneTrack';

export class AnimationClip extends ActionClipBase<'Animation'> {
  protected _type = 'Animation' as const;

  data: ActionClipData<'Animation'>;

  private constructor(parent: IDirectable, data: ActionClipData<'Animation'>) {
    super(parent);
    this.data = data;
  }

  static construct(parent: CutsceneTrack, { name, start, end, keys }: CreateActionClipDto<'Animation'>) {
    const id = genUUID();
    return new AnimationClip(parent, { id, type: 'Animation', name, start, end, keys });
  }

  updateData: (data: UpdateActionClipDto<'Animation'>) => void = (data) => {
    this.data = { ...this.data, ...data };
  };

  addKey: (key: ActionClipTypeToKeyMap['Animation']) => void = (key) => {
    this.data.keys.push(key);
  };

  updateKeys: (time: number, keyData: ActionClipTypeToKeyMap['Animation']) => void = (keyId, keyData) => {
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
