import { ComponentData } from '../component';

export type EntityJson = {
  id: string;
  name: string;
  components: ComponentData[];
  children: EntityJson[];
};
