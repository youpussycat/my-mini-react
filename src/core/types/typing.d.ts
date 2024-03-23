export declare interface MyReactComponentType {
  (...args: any[]): MyReactNodeType;
}

export declare interface MyReactNodeType {
  type: string | MyReactComponentType;
  props: any;
  key: null | string;
  ref: null | any;
}

export declare type AnyFunction = (...args: any[]) => any;

export declare type MyReactNodeChildType =
  | number
  | string
  | null
  | boolean
  | MyReactComponentType;
