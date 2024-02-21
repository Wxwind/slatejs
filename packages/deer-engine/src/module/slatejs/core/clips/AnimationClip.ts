import { genUUID } from '@/util';
import { CreateActionClipByJsonDto, CreateActionClipDto, UpdateActionClipDto } from '../type';
import { ActionClip } from '../ActionClip';
import { CutsceneTrack } from '../CutsceneTrack';
import { AnimatedParameterCollection } from '../AnimatedParameterCollection';
import { Component, egclass } from '@/core';
import { attachTrack } from '../decorators';

@egclass()
@attachTrack(['AnimationTrack'])
export class AnimationClip extends ActionClip {
  protected _type = 'Animation' as const;

  protected _animatedParams!: AnimatedParameterCollection;

  get animatedData(): AnimatedParameterCollection {
    return this._animatedParams;
  }

  get animatedParametersTarget(): ActionClip | Component | undefined {
    return this;
  }

  constructor(parent: CutsceneTrack, id: string, name: string, start: number, end: number) {
    super(parent, id, name, start, end);
  }

  static constructFromJson(parent: CutsceneTrack, data: CreateActionClipByJsonDto) {
    const clip = new AnimationClip(parent, data.id, data.name, data.startTime, data.endTime);
    const animatedParams = AnimatedParameterCollection.constructFromJson(clip, data.animatedParams);
    clip._animatedParams = animatedParams;
    return clip;
  }

  static construct(parent: CutsceneTrack, data: CreateActionClipDto) {
    const clip = new AnimationClip(parent, genUUID('csc'), data.name || 'animation clip', data.startTime, data.endTime);
    clip._animatedParams = new AnimatedParameterCollection();
    return clip;
  }

  updateData: (data: UpdateActionClipDto) => void = (data) => {
    data.startTime && (this._startTime = data.startTime);
    data.endTime && (this._endTime = data.endTime);
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
