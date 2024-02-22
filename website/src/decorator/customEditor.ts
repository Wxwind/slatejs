import { Editor, EditorProps } from '@/components/editor/Editor';
import { ClassClassDecorator, NoAbstractCtor } from 'deer-engine';
import { FC, ReactNode } from 'react';

export const globalEditorMap = new Map<NoAbstractCtor, FC<EditorProps<any>>>();

export function customEditor<Class extends new () => Editor>(ctor: NoAbstractCtor): ClassClassDecorator<Class> {
  return (target: Class, context: ClassDecoratorContext<Class>) => {
    const singleton = new target();
    globalEditorMap.set(ctor, singleton.onEditorGUI);
  };
}

export function getEditorRenderer(ctor: NoAbstractCtor) {
  const renderFunc = globalEditorMap.get(ctor);
  if (!renderFunc) {
    throw new Error(`the type ${ctor.name} hasn't be registered Editor class yet.`);
  }

  return renderFunc;
}
