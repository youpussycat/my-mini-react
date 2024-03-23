/** 函数组件类型 */
export declare interface MyReactComponentType {
  /**
   * @param {...any} props 函数组件的 props
   * @returns {MyReactNodeType} 函数组件对应的 react 虚拟 dom
   */
  (...props: any[]): MyReactNodeType;
}
/** 虚拟 dom 类型 */
export declare interface MyReactNodeType {
  /** 虚拟 dom 的类型 */
  type: string | MyReactComponentType;
  /** 虚拟 dom 的 props */
  props: any;
  /** 虚拟 dom 的唯一标识 */
  key: null | string;
  /** 虚拟 dom 的引用 */
  ref: null | any;
}
/** 万能函数类型 */
export declare type AnyFunction = (...args: any[]) => any;
/** react 虚拟 dom 中的子节点类型 */
export declare type MyReactNodeChildType =
  | number
  | string
  | null
  | boolean
  | MyReactNodeType;

/** createRoot 返回值中 render 的类型 */
declare interface ReactRootRenderType {
  /**
   * @param {MyReactNodeType} element 要渲染的 react 元素
   */
  (element: MyReactNodeType): void;
}

/** createRoot 返回值类型 */
export declare interface ReactRootType {
  /** 用于在根容器中渲染 react 元素 */
  render: ReactRootRenderType;
  /** 用于注销当前 react 根节点 */
  unmount(): void;
}

/** createRoot API 的 options 参数类型 */
export declare interface ReactCreateRootOptionsType {
  /** 错误处理 */
  onRecoverableError?: AnyFunction;
  /** 已不用，唯一标识 */
  identifierPrefix?: string;
}
