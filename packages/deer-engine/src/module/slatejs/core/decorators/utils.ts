import { AnyCtor, getMetadataFromCtor, getSubclassOf, globalTypeMap } from '@/core';
import { ActionClip } from '../ActionClip';

export function findAttachableClips(trackName: string | undefined) {
  if (!trackName) return [];
  const res: AnyCtor[] = [];

  const trackCtor = globalTypeMap.get(trackName);
  if (!trackCtor) throw new Error(`Track '${trackName}' hasn't been registed by @egclass yet`);

  for (const ctor of getSubclassOf(ActionClip)) {
    const metadata = getMetadataFromCtor(ctor);
    const allowTracks = metadata.__attachTracks__?.map((a) => globalTypeMap.get(a));
    if (allowTracks && allowTracks.includes(trackCtor)) {
      res.push(ctor);
    }
  }

  return res;
}
