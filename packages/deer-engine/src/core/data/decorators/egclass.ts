/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-types */
import { ClassClassDecorator } from '../type';
import { AnyCtor, getClassName } from './util';

export function egclass<Class extends abstract new (...args: any[]) => any>(name?: string): ClassClassDecorator<Class> {
  return (target: Class, context: ClassDecoratorContext<Class>) => {
    globalTypeDic.set(name || getClassName(target), target);
  };
}

export const globalTypeDic = new Map<string, Function>();
