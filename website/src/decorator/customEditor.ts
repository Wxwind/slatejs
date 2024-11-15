import { DefaultEditor } from '@/components/editor/DefaultEditor';
import { NoAbstractCtor } from 'deer-engine';
import { FC } from 'react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface EditorProps<T = any> {
  target: T;
}

export type EditorComp<T> = FC<EditorProps<T>>;

export const globalEditorMap = new Map<NoAbstractCtor, FC<EditorProps>>();

export function registerEditor(ctor: NoAbstractCtor, renderFunc: FC<EditorProps>) {
  globalEditorMap.set(ctor, renderFunc);
}

export function getEditorRenderer(ctor: NoAbstractCtor) {
  const renderFunc = globalEditorMap.get(ctor);
  if (!renderFunc) {
    return DefaultEditor;
  }

  return renderFunc;
}
