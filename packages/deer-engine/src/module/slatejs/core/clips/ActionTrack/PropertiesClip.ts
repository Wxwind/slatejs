import { genUUID, isNil } from '@/util';
import { CreateActionClipByJsonDto, CreateActionClipDto, UpdateActionClipDto } from '../../type';
import { ActionClip } from '../../ActionClip';
import { CutsceneTrack } from '../../CutsceneTrack';
import { AnimatedParameterCollection } from '../../AnimatedParameterCollection';
import { Entity, egclass, property } from '@/core';
import { attachTrack } from '../../decorators';

@egclass()
@attachTrack(['ActionTrack'])
export class PropertiesClip extends ActionClip {
  protected _type = 'Properties' as const;

  @property({ type: AnimatedParameterCollection })
  private _animatedParams!: AnimatedParameterCollection;

  get animatedData(): AnimatedParameterCollection {
    return this._animatedParams;
  }

  get animatedParametersTarget(): Entity | undefined {
    return this.actor;
  }

  constructor(parent: CutsceneTrack, id: string, name: string, start: number, end: number) {
    super(parent, id, name, start, end);
  }

  static constructFromJson(parent: CutsceneTrack, data: CreateActionClipByJsonDto) {
    const clip = new PropertiesClip(parent, data.id, data.name, data.startTime, data.endTime);
    const animatedParams = AnimatedParameterCollection.constructFromJson(clip, data.animatedParams);
    clip._animatedParams = animatedParams;
    return clip;
  }

  static construct(parent: CutsceneTrack, data: CreateActionClipDto) {
    const clip = new PropertiesClip(
      parent,
      genUUID('csc'),
      data.name || 'properties clip',
      data.startTime,
      data.endTime
    );

    const animatedParams = new AnimatedParameterCollection();

    clip._animatedParams = animatedParams;
    return clip;
  }

  addProperty = (compTypeName: string, paramPath: string) => {
    const propParam = this._animatedParams?.addParameter(this, compTypeName, paramPath);

    if (!propParam) return;

    propParam.addKey(1, 0);
    propParam.addKey(5, 0);
    this.signals.clipUpdated.emit();
  };

  updateData: (data: UpdateActionClipDto) => void = (data) => {
    if (!isNil(data.startTime)) {
      if (data.startTime < 0) this._startTime = 0;
      else this._startTime = data.startTime;
    }

    if (!isNil(data.endTime)) {
      if (data.endTime < this._startTime) this._endTime = this._startTime + 0.1;
      else this._endTime = data.endTime;
    }

    data.name && (this._name = data.name);
    this.signals.clipUpdated.emit();
  };

  protected onInitialize(): boolean {
    return true;
  }
  protected onEnter(): void {}
  protected onUpdate(): void {}
  protected onExit(): void {}
  protected onReverseEnter(): void {}
  protected onReverseExit(): void {}
}
