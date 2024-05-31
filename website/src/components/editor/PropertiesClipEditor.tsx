import { EditorComp, registerEditor } from '@/decorator';
import { JsonModule, PropertiesClip } from 'deer-engine';

const PropertiesClipEditorComp: EditorComp<PropertiesClip> = (props) => {
  const { target } = props;

  return <div className="w-full">{JsonModule.toJson(target)}</div>;
};

registerEditor(PropertiesClip, PropertiesClipEditorComp);
