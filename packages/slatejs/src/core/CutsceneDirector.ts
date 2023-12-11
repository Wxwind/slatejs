import { SLATEJS_VERSION } from '@/config';
import { isNil } from '@/util';
import { CutsceneGroup } from './CutsceneGroup';
import { IDirectableTimePointer, UpdateTimePointer, StartTimePointer, EndTimePointer } from './TimePointer';
import { ActorGroup } from './groups';
import { CutsceneData, GroupData, TrackData, ActionClipData, GroupType, ActionClip } from './type';

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
export class CutsceneDirector {
  private _playState: PlayState = PlayState.Stop;

  private _currentTime = 0;
  private _previousTime = 0;
  private _lastStartPlayTime = 0;

  private _playRate = 1;

  private _playTimeMin = 0;
  private _playTimeMax = 32;

  public get playState(): PlayState {
    return this._playState;
  }

  public set playState(v: PlayState) {
    this._playState = v;
  }

  public get currentTime(): number {
    return this._currentTime;
  }

  public set currentTime(v: number) {
    this._currentTime = v;
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
  }

  public get playTimeMin(): number {
    return this._playTimeMin;
  }

  public set playTimeMin(v: number) {
    this._playTimeMin = v;
  }

  public get playTimeMax(): number {
    return this._playTimeMax;
  }

  public set playTimeMax(v: number) {
    this._playTimeMax = v;
  }

  public get playTimeLength() {
    return this.playTimeMax - this.playTimeMin;
  }

  private _viewTimeMax = 500; // max seconds could be displayed in timeline
  private _groups: CutsceneGroup[] = [];

  private _timePointers: IDirectableTimePointer[] = [];
  private _updateTimePointers: UpdateTimePointer[] = [];

  // Expose to ResoucesStore
  public get groups(): CutsceneGroup[] {
    return this._groups;
  }

  public get viewTimeMax(): number {
    return this._viewTimeMax;
  }
  public set viewTimeMax(v: number) {
    this._viewTimeMax = v;
  }

  public get curTime(): number {
    return this._currentTime;
  }

  play = () => {
    this.playState = PlayState.PlayForward;
    this._lastStartPlayTime = this.currentTime;
  };

  playReverse = () => {
    this.playState = PlayState.PlayBackward;

    if (this.currentTime === 0) {
      this.currentTime = this.playTimeMax;
      this._lastStartPlayTime = 0;
    } else {
      this._lastStartPlayTime = this.currentTime;
    }
  };

  pause = () => {
    this.playState = PlayState.Stop;
  };

  stop = () => {
    const t = this.playState !== PlayState.Stop ? this._lastStartPlayTime : 0;
    this.sample(t);
    this.playState = PlayState.Stop;
  };

  tick = (deltaTime: number) => {
    if (this.playState === PlayState.Stop) return;

    if (this.playState === PlayState.PlayForward && this.currentTime >= this.playTimeMax) {
      this.stop();
      return;
    }

    if (this.playState === PlayState.PlayBackward && this.currentTime <= 0) {
      this.stop();
      return;
    }

    const delta = (deltaTime / 1000) * this.playRate;

    this.currentTime += this.playState === PlayState.PlayForward ? delta : -delta;
    this.sample(this.currentTime);
    this.previousTime = this.currentTime;
  };

  private sample = (curTime: number) => {
    this._currentTime = curTime;

    if (this._previousTime === this._currentTime) {
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
    const groups: GroupData[] = [];

    for (const group of this._groups) {
      const tracks: TrackData[] = [];

      for (const track of group.children) {
        const clips: ActionClipData[] = [];

        for (const clip of track.children) {
          const actionClip = clip as ActionClip;
          clips.push(actionClip.data);
        }

        const trackData: TrackData = {
          id: track.id,
          name: track.name,
          children: clips,
        };
        tracks.push(trackData);
      }

      const groupsData: GroupData = {
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

  parseJson = (data: string) => {
    const d = JSON.parse(data) as CutsceneData;
    // TODO: parse json
  };

  findGroup = (groupId: string) => {
    return this._groups.find((a) => a.id === groupId);
  };

  addGroup = (type: GroupType) => {
    let newGroup = null;
    switch (type) {
      case 'Actor':
        newGroup = new ActorGroup(this);
        break;

      default:
        break;
    }

    if (isNil(newGroup)) {
      console.error(`can not add group of type ${type}`);
      return;
    }

    this._groups.push(newGroup);
    return newGroup;
  };

  removeGroup = (groupId: string) => {
    const index = this._groups.findIndex((a) => a.id === groupId);
    if (isNil(index)) {
      console.log(`can not remove group(id = '${groupId}')`);
      return;
    }

    this._groups.splice(index, 1);
  };

  findTrack = (groupId: string, trackId: string) => {
    return this.findGroup(groupId)?.findTrack(trackId);
  };

  findClip = (groupId: string, trackId: string, clipId: string) => {
    return this.findGroup(groupId)?.findTrack(trackId)?.findClip(clipId);
  };
}
