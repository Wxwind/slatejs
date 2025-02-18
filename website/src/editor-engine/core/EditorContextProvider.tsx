import React from 'react';
import { EditorEngine } from './EditorEngine';

const editorEngine = new EditorEngine();
const context = React.createContext(editorEngine);
const Provider = context.Provider;

export const useEditorEngine = () => {
  return React.useContext(context);
};

export const useStore = (store: 'projectStore') => {
  return useEditorEngine()[store];
};

export interface EditorEngineProviderProps {
  children: React.ReactNode;
}

export function EditorEngineProvider(props: EditorEngineProviderProps) {
  return <Provider value={editorEngine}>{props.children}</Provider>;
}
