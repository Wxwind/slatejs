export type EntityForHierarchy = {
  id: string;
  name: string;
  children: EntityForHierarchy[];
};
