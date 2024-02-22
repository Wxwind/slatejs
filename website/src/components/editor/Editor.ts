import { FC } from 'react';

export interface EditorProps<T = any> {
  target: T;
}

export abstract class Editor {
  abstract onEditorGUI: FC<EditorProps>;
}
