export type PartialSome<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type PartialWithRequireSome<T, K extends keyof T> = Partial<T> & Pick<T, K>;
