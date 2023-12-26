export type GroupOptions = { name: string } & Partial<{
  id: string;
  name: string;
  displayOrder: number;
  style: string;
}>;

export type IPropertyOptions = {
  type?: string;
  group?: string | GroupOptions;
  displayName?: string;
  tooltip?: string;
  min?: number;
  max?: number;
};
