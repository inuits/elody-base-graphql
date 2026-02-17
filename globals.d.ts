// globals.d.ts
declare module '*/generated-types/type-defs' {
  export type Maybe<T> = T | null;
  export type Exact<T extends { [key: string]: unknown }> = {
    [K in keyof T]: T[K];
  };
  export type Scalars = {
    ID: string;
    String: string;
    Boolean: boolean;
    Int: number;
    Float: number;
  };
  const content: any;
  export default content;
  export const Query: any;
  export const Mutation: any;
}
