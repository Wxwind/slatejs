import { SLATEJS_VERSION } from '@/config';
import { isNil } from '@/util';
import { CutsceneGroup } from './CutsceneGroup';
import { IDirectableTimePointer, UpdateTimePointer, StartTimePointer, EndTimePointer } from './TimePointer';
import { ActorGroup } from './groups';
import {
  CutsceneData,
  CutsceneGroupData,
  CutsceneTrackData,
  ActionClipData,
  CutsceneGroupType,
  PlayOptions,
  PlayDirection,
  PlayStopMode,
  PlayWrapMode,
} from './type';
import { DirectorGroup } from './groups/DirectorGroup';
import { DeerEngine, SceneManager } from '@/core';
import { Signal } from 'eventtool';
import { CutsceneEditor } from './CutsceneEditor';
import { ISerializable } from '@/interface';
import { MathUtils } from '@/math';

/**
 * Play timeline in edit mode.
 */
export class Cutscene implements ISerializable<CutsceneData> {
  private _currentTime = 0;
  private _previousTime = 0;

  // used when playing, shouldn't be serialized.
  private _playTimeMin = 0;
  private _playTimeMax = 20;
  private _playDirection: PlayDirection = 'forwards';
  private _playWrapMode: PlayWrapMode = 'once';
  /** callback when cutscene stopped, whether playing to end or interrupt by others. Will be cleared once raised
   */
  private _playOnFinished: (() => void) | undefined;

  // settings
  private _playRate = 1;
  private _length = 15; // total length, means endtime in runtime & editor
  private _stopMode: PlayStopMode = 'skip';
  private _wrapMode: PlayWrapMode = 'once';

  public get currentTime(): number {
    return this._currentTime;
  }

  public set currentTime(v: number) {
    this._currentTime = v;
    this.signals.currentTimeUpdated.emit(v);
  }

  public get playRate(): number {
    return this._playRate;
  }

  public set playRate(v: number) {
    this._playRate = v;
    this.signals.settingsUpdated.emit();
  }

  public get playTimeMin(): number {
    return this._playTimeMin;
  }

  public set playTimeMin(v: number) {
    this._playTimeMin = MathUtils.clamp(v, 0, this.playTimeMax);
    this.signals.settingsUpdated.emit();
  }

  public get playTimeMax(): number {
    return this._playTimeMax;
  }

  public set playTimeMax(v: number) {
    this._playTimeMax = MathUtils.clamp(v, this.playTimeMin, this.length);
    this.signals.settingsUpdated.emit();
  }

  public get playTimeLength() {
    return this.playTimeMax - this.playTimeMin;
  }

  public set length(v: number) {
    this._length = v;
    this.signals.lengthChanged.emit(v);
  }

  public get length(): number {
    return this._length;
  }

  public set stopMode(v: PlayStopMode) {
    this._stopMode = v;
    this.signals.settingsUpdated.emit();
  }

  public get stopMode(): PlayStopMode {
    return this._stopMode;
  }

  public set wrapMode(v: PlayWrapMode) {
    this._wrapMode = v;
    this.signals.settingsUpdated.emit();
  }

  public get wrapMode(): PlayWrapMode {
    return this._wrapMode;
  }

  private _groups: CutsceneGroup[] = [];

  // Expose to ResoucesStore
  public get groups(): CutsceneGroup[] {
    return this._groups;
  }

  private _timePointers: IDirectableTimePointer[] = [];
  private _updateTimePointers: UpdateTimePointer[] = [];

  private _isActive = false;
  private _isPaused = false;

  readonly signals = {
    groupCountUpdated: new Signal(),
    currentTimeUpdated: new Signal<[number]>(),
    lengthChanged: new Signal<[number]>(),
    settingsUpdated: new Signal(),
  };

  constructor(public engine: DeerEngine) {}

  /** must call this if want to play cutscene by itself */
  update = (dt: number) => {
    if (this._isActive) {
      if (this._isPaused) {
        this.sample();
        return;
      }

      this._update(dt);
    }
  };

  private _update = (dt: number) => {
    dt *= this.playRate;
    this.currentTime += this._playDirection === 'forwards' ? dt : -dt;

    switch (this._playWrapMode) {
      case 'once':
        if (this._playDirection === 'forwards' && this.currentTime >= this.playTimeMax) {
          this.stop();
          return;
        } else if (this._playDirection === 'backwards' && this.currentTime <= this.playTimeMin) {
          this.stop();
          return;
        }
        break;

      case 'loop':
        if (this.currentTime >= this.playTimeMax) {
          this.sample(this.playTimeMin);
          // FIXME: may the following code is better?
          // this.currentTime = this.playTimeMin + (this.currentTime - this.playTimeMax);
          this.currentTime = this.playTimeMin + dt;
        } else {
          if (this.currentTime <= this.playTimeMin) {
            this.sample(this.playTimeMax);
            // this.currentTime = this.playTimeMin - (this.playTimeMin - this.currentTime);
            this.currentTime = this.playTimeMax - dt;
          }
        }
        break;

      case 'pingPong':
        if (this.currentTime >= this.playTimeMax) {
          this.sample(this.playTimeMax);
          // FIXME: may the following code is better?
          // this.currentTime = this.playTimeMax - (this.currentTime - this.playTimeMax);
          this.currentTime = this.playTimeMax - dt;
          this._playDirection = this.playRate >= 0 ? 'backwards' : 'forwards';
        } else {
          if (this.currentTime <= this.playTimeMin) {
            this.sample(this.playTimeMin);
            // this.currentTime = this.playTimeMin + (this.playTimeMin - this.currentTime);
            this.currentTime = this.playTimeMin + dt;
            this._playDirection = this.playRate >= 0 ? 'forwards' : 'backwards';
          }
        }
        break;

      default:
        break;
    }

    this.sample();
  };

  play = ({
    startTime = 0,
    endTime = this.length,
    wrapMode = 'once',
    playDirection = 'forwards',
    onFinished,
  }: PlayOptions) => {
    if (startTime > endTime && playDirection == 'forwards') {
      throw new Error('End time must be greater than start time');
    }

    if (this._isPaused) {
      console.warn('Playing on paused cutscene will resume to play');
      this._playDirection = playDirection;
      this.resume();
      return;
    }

    if (this._isActive) {
      console.warn('Cutscene is still running, Play() will be ignored');
      return;
    }

    this._playTimeMin = 0; // reset in case playTimeMax failed to be set by setter.

    this.playTimeMax = endTime;
    this.playTimeMin = startTime;
    this._playWrapMode = wrapMode;
    this._playDirection = playDirection;
    this._playOnFinished = onFinished;

    if (playDirection === 'forwards' && this.currentTime >= this.playTimeMax) {
      console.log(
        `error when in play(): currentTime=${this.currentTime} playTimeMax=${this.playTimeMax}. Will reset currentTime to playTimemin='${this.playTimeMin}'s`
      );
      this.currentTime = this.playTimeMin;
    } else if (playDirection === 'backwards' && this.currentTime <= this.playTimeMin) {
      console.log(
        `error when in play(): currentTime=${this.currentTime} playTimeMin=${this.playTimeMin}. Will reset currentTime to playTimeMax='${this.playTimeMax}'s`
      );
      this.currentTime = this.playTimeMax;
    }

    this._isActive = true;
    this._isPaused = false;

    this.sample();
  };

  playReverse = (startTime: number, endTime: number) => {
    this.play({ startTime, endTime, playDirection: 'backwards' });
  };

  pause = () => {
    this._isPaused = true;
  };

  resume = () => {
    this._isPaused = false;
  };

  stop = (stopmode = this._stopMode) => {
    if (!this._isActive) {
      return;
    }

    this._isActive = false;
    this._isPaused = false;

    switch (stopmode) {
      case 'skip':
        this.sample(this.playTimeMax);
        break;
      case 'rewind':
        this.sample(this.playTimeMin);
        break;
      case 'hold':
        this.sample();
        break;
      case 'skipRewindNoUndo':
        this.sample(this.playTimeMax);
        this.rewindNoUndo();
        break;
      default:
        break;
    }

    this._playOnFinished?.();
    this._playOnFinished = undefined;
  };

  private rewindNoUndo() {
    if (this._isActive) {
      this.stop('hold');
    }
    this.currentTime = 0;
    this._previousTime = this.currentTime; // allow no undo
    this.sample();
  }

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

  resample = () => {
    if (CutsceneEditor.isInPreviewMode) return;

    if (this.currentTime > 0 && this.currentTime < this.length && this._timePointers.length > 0) {
      this.sampleTimepointers(0, this.currentTime);
      this.sampleTimepointers(this.currentTime, 0);
    }
  };

  // Initialize update time pointers bottom to top.
  // Initialize start&end time pointers order by the time pointed.
  // Make sure the timepointer event order is
  // group enter -> track enter -> clip enter -> clip exit -> track exit -> group exit
  private initializeTimePointers = () => {
    const timePointers: IDirectableTimePointer[] = [];
    const updateTimePointer: UpdateTimePointer[] = [];

    for (const group of [...this._groups].reverse()) {
      if (group.isActive && group.initialize()) {
        timePointers.push(new StartTimePointer(group));

        for (const track of [...group.children].reverse()) {
          if (track.isActive && track.initialize()) {
            timePointers.push(new StartTimePointer(track));

            for (const clip of [...track.children].reverse()) {
              if (clip.isActive && track.initialize()) {
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
    // make sure pointer will be trigged when dragging clip in editor.
    if (!CutsceneEditor.isInPreviewMode || curTime > prevTime) {
      for (const p of this._timePointers) {
        p.triggerForward(curTime, prevTime);
      }
    }

    if (!CutsceneEditor.isInPreviewMode || curTime < prevTime) {
      for (let i = this._timePointers.length - 1; i >= 0; i--) {
        this._timePointers[i].triggerBackward(curTime, prevTime);
      }
    }

    for (const p of this._updateTimePointers) {
      p.update(curTime, prevTime);
    }
  };

  serialize: () => CutsceneData = () => {
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

  deserialize = (data: CutsceneData) => {
    // TODO: parse json
  };

  findGroup = (groupId: string) => {
    return this._groups.find((a) => a.id === groupId);
  };

  addGroup = (entityId: string, type: CutsceneGroupType) => {
    const sceneManager = this.engine.getManager(SceneManager);
    if (isNil(sceneManager.mainScene)) {
      throw new Error("couldn't find activeScene");
    }
    const entity = sceneManager.mainScene.entityManager.findEntityById(entityId);
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
}
