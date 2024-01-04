import { genUUID } from '@/util';
import { CreateActionClipByJsonDto, CreateActionClipDto, UpdateActionClipDto } from '../type';
import { ActionClip } from '../ActionClip';
import { CutsceneTrack } from '../CutsceneTrack';
import { AnimatedParameterCollection } from '../AnimatedParameterCollection';

export class TransformClip extends ActionClip {
  protected _type = 'Transform' as const;

  private _animatedParams: AnimatedParameterCollection | undefined;

  get animatedData(): AnimatedParameterCollection | undefined {
    return this._animatedParams;
  }

  get animatedParameterTarget(): any {
    throw new Error('Method not implemented.');
  }

  private constructor(parent: CutsceneTrack, id: string, name: string, start: number, end: number) {
    super(parent, id, name, start, end);
  }

  static constructFromJson(parent: CutsceneTrack, data: CreateActionClipByJsonDto) {
    const clip = new TransformClip(parent, data.id, data.name, data.startTime, data.endTime);
    const animatedParams = AnimatedParameterCollection.constructFromJson(clip, data.animatedParams);
    clip._animatedParams = animatedParams;
    return clip;
  }

  static construct(parent: CutsceneTrack, data: CreateActionClipDto) {
    const clip = new TransformClip(parent, genUUID('csc'), data.name || 'transform clip', data.startTime, data.endTime);
    clip._animatedParams = AnimatedParameterCollection.construct();
    return clip;
  }

  updateData: (data: UpdateActionClipDto) => void = (data) => {
    data.startTime && (this._startTime = data.startTime);
    data.endTime && (this._endTime = data.endTime);
    data.name && (this._name = data.name);
    this.signals.clipUpdated.emit();
  };
}
