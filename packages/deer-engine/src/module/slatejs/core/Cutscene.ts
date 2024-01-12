import { SLATEJS_VERSION } from '@/config';
import { isNil } from '@/util';
import { CutsceneGroup } from './CutsceneGroup';
import { IDirectableTimePointer, UpdateTimePointer, StartTimePointer, EndTimePointer } from './TimePointer';
import { ActorGroup } from './groups';
import { CutsceneData, CutsceneGroupData, CutsceneTrackData, ActionClipData, CutsceneGroupType } from './type';
import { DirectorGroup } from './groups/DirectorGroup';
import { deerEngine } from '@/core';
import { Signal } from '@/packages/signal';

/**
 * PlayState in editor mode has no state called 'paused' because
 * 'paused' is the same as 'stopped'
 */
export enum PlayState {
  Stop = 'Stop',
  PlayForward = 'PlayForward',
  PlayBackward = 'PlayBackward',
}

/**
 * Play timeline in edit mode.
 */
export class Cutscene {
  private _currentTime = 0;
  private _previousTime = 0;

  private _playRate = 1;

  private _playTimeMin = 0;
  private _playTimeMax = 32;

  // FIXME
  private length = 0;

  public get currentTime(): number {
    return this._currentTime;
  }

  public set currentTime(v: number) {
    this._currentTime = v;
    this.signals.timeUpdated.emit();
  }

  public get previousTime(): number {
    return this._previousTime;
  }

  public set previousTime(v: number) {
    this._previousTime = v;
  }

  public get playRate(): number {
    return this._playRate;
  }

  public set playRate(v: number) {
    this._playRate = v;
    this.signals.cutsceneUpdated.emit();
  }

  public get playTimeMin(): number {
    return this._playTimeMin;
  }

  public set playTimeMin(v: number) {
    this._playTimeMin = v;
    this.signals.cutsceneUpdated.emit();
  }

  public get playTimeMax(): number {
    return this._playTimeMax;
  }

  public set playTimeMax(v: number) {
    this._playTimeMax = v;
    this.signals.cutsceneUpdated.emit();
  }

  public get playTimeLength() {
    return this.playTimeMax - this.playTimeMin;
  }

  private _groups: CutsceneGroup[] = [];

  private _timePointers: IDirectableTimePointer[] = [];
  private _updateTimePointers: UpdateTimePointer[] = [];

  // Expose to ResoucesStore
  public get groups(): CutsceneGroup[] {
    return this._groups;
  }

  readonly signals = {
    groupCountUpdated: new Signal(),
    timeUpdated: new Signal(),
    cutsceneUpdated: new Signal(),
  };

  play = () => {};

  playReverse = () => {};

  pause = () => {};

  stop = () => {};

  sample = (time: number = this.currentTime) => {
    this.currentTime = time;

    // ignore same minmax times. If you are in min or max time, it allows you to change prop in comp panel. And avoid to change props if not, because cutscene is in contolled mode in editor.
    if (this._previousTime === this._currentTime && (time === 0 || time === this.length)) {
      return;
    }

    // init
    if (this._currentTime > 0 && this._previousTime === 0) {
      this.initializeTimePointers();
    }

    // sample
    if (this._timePointers.length > 0) {
      this.sampleTimepointers(this._currentTime, this._previousTime);
    }

    this._previousTime = this._currentTime;
  };

  // Initialize update time pointers bottom to top.
  // Initialize start&end time pointers order by the time pointed.
  // Make sure the timepointer event order is
  // group enter -> track enter -> clip enter -> clip exit -> track exit -> group exit
  private initializeTimePointers = () => {
    const timePointers: IDirectableTimePointer[] = [];
    const updateTimePointer: UpdateTimePointer[] = [];

    for (const group of [...this._groups].reverse()) {
      if (group.isActive && group.onInitialize()) {
        timePointers.push(new StartTimePointer(group));

        for (const track of [...group.children].reverse()) {
          if (track.isActive && track.onInitialize()) {
            timePointers.push(new StartTimePointer(track));

            for (const clip of [...track.children].reverse()) {
              if (clip.isActive && track.onInitialize()) {
                timePointers.push(new StartTimePointer(clip));
                // -----
                const u3 = new UpdateTimePointer(clip);
                updateTimePointer.push(u3);
                timePointers.push(new EndTimePointer(clip));
              }
            }

            const u2 = new UpdateTimePointer(track);
            updateTimePointer.push(u2);
            timePointers.push(new EndTimePointer(track));
          }
        }

        const u1 = new UpdateTimePointer(group);
        updateTimePointer.push(u1);
        timePointers.push(new EndTimePointer(group));
      }
    }

    timePointers.sort((p1, p2) => p1.time - p2.time);
    this._timePointers = timePointers;
    this._updateTimePointers = updateTimePointer;
  };

  private sampleTimepointers = (curTime: number, prevTime: number) => {
    if (curTime > prevTime) {
      for (const p of this._timePointers) {
        p.triggerForward(curTime, prevTime);
      }
    } else if (curTime < prevTime) {
      for (const p of this._timePointers) {
        p.triggerBackward(curTime, prevTime);
      }
    }

    for (const p of this._updateTimePointers) {
      p.update(curTime, prevTime);
    }
  };

  toJsonObject: () => CutsceneData = () => {
    // TODO: save and load json
    const groups: CutsceneGroupData[] = [];

    for (const group of this._groups) {
      const tracks: CutsceneTrackData[] = [];

      for (const track of group.children) {
        const clips: ActionClipData[] = [];

        for (const clip of track.children) {
          const clipData: ActionClipData = {
            id: clip.id,
            type: clip.type,
            name: clip.name,
            startTime: clip.startTime,
            endTime: clip.endTime,
            animatedParams: {
              animatedParamArray: [],
            },
          };

          clips.push(clipData);
        }

        const trackData: CutsceneTrackData = {
          id: track.id,
          type: track.type,
          name: track.name,
          children: clips,
        };
        tracks.push(trackData);
      }

      const groupsData: CutsceneGroupData = {
        id: group.id,
        name: group.name,
        entityId: group.actor?.id,
        children: tracks,
      };
      groups.push(groupsData);
    }

    const cutsceneData: CutsceneData = {
      version: SLATEJS_VERSION,
      data: groups,
    };
    return cutsceneData;
  };

  toJson: () => string = () => {
    return JSON.stringify(this.toJsonObject());
  };

  loadFromJson = (data: string) => {
    const d = JSON.parse(data) as CutsceneData;
    // TODO: parse json
  };

  findGroup = (groupId: string) => {
    return this._groups.find((a) => a.id === groupId);
  };

  addGroup = (entityId: string, type: CutsceneGroupType) => {
    // FIXME: slatejs's deerEngine !== website's deerEngine if use resolve() plugin to resolve external dependencies in deer-engine
    if (isNil(deerEngine.activeScene)) {
      throw new Error("couldn't find activeScene");
    }
    const entity = deerEngine.activeScene.entityManager.findEntityById(entityId);
    if (isNil(entity)) {
      throw new Error(`AddGroup: counldn't find entity (id= ${entityId})`);
    }

    let newGroup = null;
    switch (type) {
      case 'Actor':
        newGroup = ActorGroup.construct(this);
        break;
      case 'Director':
        newGroup = DirectorGroup.construct(this);
        break;
      default:
        break;
    }

    if (isNil(newGroup)) {
      console.error(`can not add group of type ${type}`);
      return;
    }
    newGroup.actor = entity;

    this._groups.push(newGroup);
    this.signals.groupCountUpdated.emit();

    return newGroup;
  };

  removeGroup = (groupId: string) => {
    const index = this._groups.findIndex((a) => a.id === groupId);
    if (isNil(index)) {
      console.log(`can not remove group(id = '${groupId}')`);
      return;
    }

    this._groups.splice(index, 1);
    this.signals.groupCountUpdated.emit();
  };

  findTrack = (groupId: string, trackId: string) => {
    return this.findGroup(groupId)?.findTrack(trackId);
  };

  findClip = (groupId: string, trackId: string, clipId: string) => {
    return this.findGroup(groupId)?.findTrack(trackId)?.findClip(clipId);
  };
}
