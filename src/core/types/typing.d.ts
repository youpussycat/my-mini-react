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
  props: {
    children?: MyReactNodeChildType | MyReactNodeChildType[];
    [key: string]: any;
  };
  /** 虚拟 dom 的唯一标识 */
  key: null | string;
  /** 虚拟 dom 的引用 */
  ref: null | any;
}
/** 万能函数类型 */
export declare type AnyFunction = (...args: any[]) => any;
/** react 虚拟 dom 中的子节点类型,无数组 */
export declare type MyReactNodeChildTypeWithArr =
  | number
  | string
  | null
  | boolean
  | MyReactNodeType;
/** react 虚拟 dom 中的子节点类型 */
export declare type MyReactNodeChildType =
  | MyReactNodeChildTypeWithArr
  | MyReactNodeType[];

/** createRoot 返回值中 render 的类型 */
declare interface ReactRootRenderType {
  /**
   * @param {MyReactNodeType} element 要渲染的 react 元素
   */
  (element: MyReactNodeType): void;
}
/** react 元素类型 */
export declare type ReactElement = MyReactNodeType | MyReactNodeChildType;
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

/** fiber 任务调度框架中的 fiber 节点数据 */
export declare interface FiberUnitDataType {
  /** 当前要处理的虚拟节点数据 */
  vdom: MyReactNodeType;
  /** 父节点的真实 dom */
  parent: Element | null;
  /** 上一次渲染的虚拟 Fiber */
  oldFiber?: FiberUnitDataType;
}
/** 根容器对应的全局数据类型 */
export declare interface DOMDataType {
  /** 任务调度队列，元素为每次任务调度需要的数据 */
  levelFiberQueue: FiberUnitDataType[];
  /** DOM 相关数据 */
  DOMData: {
    /** 虚拟根节点节点对应的真实节点, fiber 节点中若是 parent 为 null 则是根结点  */
    rootDOM: null | Text | Element;
    /** 根容器 DOM */
    containerDOM: null | Element;
  };
}
