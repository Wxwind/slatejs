/* eslint-disable @typescript-eslint/no-explicit-any */
import { ClassClassDecorator, DecoratorMetadataObjectForRF } from '@/core';
import { ActionClip } from '../ActionClip';

export function attachTrack<Class extends new (...args: any[]) => ActionClip>(
  tracks: string[]
): ClassClassDecorator<Class> {
  console.log('allow track', tracks);

  return (target: Class, context: ClassDecoratorContext<Class>) => {
    console.log('attach to track', tracks);
    const metadata = context.metadata as DecoratorMetadataObjectForRF;
    metadata.__attachTracks__ = tracks;
  };
}
