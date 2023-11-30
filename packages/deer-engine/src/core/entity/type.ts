import { ComponentInfo } from '../component/type';

export type EntityInfo = {
  id: string;
  name: string;
  components: ComponentInfo[];
};
