import { customEditor } from '@/decorator';
import { PropertiesClip } from 'deer-engine';
import { Editor, EditorProps } from './Editor';

@customEditor(PropertiesClip)
export class PropertiesClipEditor extends Editor {
  onEditorGUI = (props: EditorProps<PropertiesClip>) => {
    const { target } = props;
    return <div>{target.id}</div>;
  };
}
