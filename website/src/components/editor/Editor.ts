import { FC } from 'react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface EditorProps<T = any> {
  target: T;
}

export abstract class Editor {
  abstract onEditorGUI: FC<EditorProps>;
}
