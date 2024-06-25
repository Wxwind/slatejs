import { EditorComp, registerEditor } from '@/decorator';
import { MeshComponent } from 'deer-engine';
import { FC } from 'react';

export const MeshComp: EditorComp<MeshComponent> = (props) => {
  const { target } = props;

  return <div>MeshComp</div>;
};

registerEditor(MeshComponent, MeshComp);
