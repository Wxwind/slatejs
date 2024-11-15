import { EditorComp } from '@/decorator';
import { Component } from 'deer-engine';
import { FC } from 'react';

export const DefaultEditor: EditorComp<any> = (props) => {
  const { target } = props;

  return <div>{target.constructor.name}</div>;
};
