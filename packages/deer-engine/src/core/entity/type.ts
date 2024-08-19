import { ComponentData } from '../component/type';

export type EntityJson = {
  id: string;
  name: string;
  components: ComponentData[];
  children: EntityJson[];
};
