export type EntityJson = {
  id: string;
  name: string;
  components: any[];
  children: EntityJson[];
};
