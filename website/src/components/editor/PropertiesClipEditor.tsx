import { customEditor } from '@/decorator';
import { JsonModule, PropertiesClip } from 'deer-engine';
import { Editor, EditorProps } from './Editor';
import { FC } from 'react';

const PropertiesClipEditorComp: FC<EditorProps<PropertiesClip>> = (props) => {
  const { target } = props;

  return <div className="w-full">{JsonModule.toJson(target)}</div>;
};

@customEditor(PropertiesClip)
export class PropertiesClipditor extends Editor {
  onEditorGUI = (props: EditorProps<PropertiesClip>) => <PropertiesClipEditorComp {...props} />;
}
