import { genUUID, isNil } from '@/util';
import { CreateActionClipByJsonDto, CreateActionClipDto, UpdateActionClipDto } from '../../type';
import { ActionClip } from '../../ActionClip';
import { CutsceneTrack } from '../../CutsceneTrack';
import { AnimatedParameterCollection } from '../../AnimatedParameterCollection';
import { Entity, TransformComponent, egclass } from '@/core';
import { attachTrack } from '../../decorators';

@egclass()
@attachTrack(['ActionTrack'])
export class TransformClip extends ActionClip {
  protected _type = 'Transform' as const;

  private _animatedParams!: AnimatedParameterCollection;

  get animatedData(): AnimatedParameterCollection {
    return this._animatedParams;
  }

  private _actorComponent: TransformComponent | undefined;

  get animatedParametersTarget(): Entity | undefined {
    // if (!isNil(this._actorComponent) && this._actorComponent.entity === this.actor) {
    //   return this._actorComponent;
    // }
    // const comp = this.actor?.findComponentByType<TransformComponent>('TransformComponent');
    // if (isNil(comp)) {
    //   throw new Error('TransformClip require TransformComponent');
    // }
    // this._actorComponent = comp;
    // return comp;
    return this.actor;
  }

  constructor(parent: CutsceneTrack, id: string, name: string, start: number, end: number) {
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
    const animatedParams = new AnimatedParameterCollection();

    const posParam = animatedParams.addParameter(clip, 'TransformComponent', 'position');
    const rotateParam = animatedParams.addParameter(clip, 'TransformComponent', 'rotation');
    const scaleParam = animatedParams.addParameter(clip, 'TransformComponent', 'scale');

    posParam.addKey(1, 0.5);
    posParam.addKey(5, 10.5);
    rotateParam.addKey(1, 90);
    rotateParam.addKey(5, 100);
    scaleParam.addKey(1, 1);
    scaleParam.addKey(5, 2);

    clip._animatedParams = animatedParams;
    return clip;
  }

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
