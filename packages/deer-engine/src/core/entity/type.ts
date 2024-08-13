import { ComponentData } from '../component/type';

export type EntityJson = {
  id: string;
  name: string;
  parent: string | undefined;
  components: ComponentData[];
};
