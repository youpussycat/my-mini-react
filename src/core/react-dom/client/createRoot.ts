import type {
  ReactRootType,
  ReactCreateRootOptionsType,
  MyReactNodeType,
  FiberUnitDataType,
  ReactElement,
  MyReactComponentType,
} from "../../types/typing";

/**
 * @description 根据虚拟 dom 生成真实 dom 【未挂载属性】
 * @param {MyReactNodeType} element 虚拟 dom
 */
const createDOM = (element: MyReactNodeType) => {
  return element.type === "TEXT_ELEMENT" // 根据类型判断创建文本节点还是正常元素
    ? document.createTextNode("")
    : document.createElement(element.type as string);
};
/**
 * @description 根据虚拟 dom 数据给真实 dom 挂载属性
 * @param {Element | Text} dom 真实 DOM
 * @param {MyReactNodeType} element 虚拟 dom
 */
const mountDOMProps = (dom: Element | Text, element: MyReactNodeType) => {
  // 挂载属性
  Object.keys(element.props).forEach((key) => {
    // 剔除 children 属性
    if (key !== "children") dom[key] = element.props[key];
  });
};
// 塑造 fiber 框架
/** 任务调度队列 */
let levelFiberQueue: FiberUnitDataType[] = [],
  /** 虚拟根节点节点对应的真实节点, fiber 节点中若是 parent 为 null 则是根结点 */
  rootDOM: Text | Element | null = null,
  containerDOM: Element | null = null;

/** 一个 fiber 任务 */
const performUnitOfFiber = () => {
  // 根据队列获取当前任务数据
  /** 当前任务数据， 数据一定是虚拟节点 */
  const unitData: FiberUnitDataType = levelFiberQueue[0];
  /** 要挂载在下一层 fiber 节点的 parent 属性上的真实 dom 节点 */
  let dom: Text | Element | null = null,
    /** 当前 fiber 节点的子节点 */
    children: MyReactNodeType["props"]["children"] | null = null;
  /** 是否是函数式组件 */
  const isFunctionCom = typeof unitData.vdom.type === "function";
  if (isFunctionCom) {
    // 若是函数组件，应该将 props 传入 type 获取下一层虚拟元素，
    //同时将当前的真实的父 dom 作为子的父， 保证子可以挂载在正确的节点下
    children = (unitData.vdom.type as MyReactComponentType)(
      unitData.vdom.props,
    );
    dom = unitData.parent;
  } else {
    // 若是非函数组件，会创建对应的真实 DOM 元素，然后进行挂载
    /** 该 fiber 节点对应的真实 DOM 节点 */
    dom = createDOM(unitData.vdom); // 创建真实 dom 节点
    mountDOMProps(dom, unitData.vdom); // 挂载属性
    // 挂载真实 dom 到其父节点上
    if (unitData.parent) unitData.parent.appendChild(dom);
    else rootDOM = dom;
    children = unitData.vdom.props.children;
  }
  // 根据当前数据将子的 fiber 数据 push 到队列中
  // children 为 对象则 看是否为数组
  if (typeof children === "object") {
    // 若是有子节点，则一定是虚拟 dom 对象
    if (Array.isArray(children)) {
      children.forEach((vdom) =>
        levelFiberQueue.push({
          vdom: vdom as MyReactNodeType,
          parent: dom as Element,
        }),
      );
    } else {
      levelFiberQueue.push({
        vdom: children!,
        parent: dom as Element,
      });
    }
  }
  // 删除 队列中的 当前 fiber 节点
  levelFiberQueue.shift();
  return null;
};
/** 任务调度机制： 空闲时间执行对应任务，空闲时间快结束时停止任务执行，剩余任务放置下一次执行 */
const FiberLoop = (deadline: IdleDeadline) => {
  while (levelFiberQueue.length) {
    // 挂载节点
    if (deadline.timeRemaining() < 1) {
      // 需要中断
      break;
    }
    // 执行任务
    performUnitOfFiber();
  }
  // 中断后等待空闲继续执行剩余任务
  if (levelFiberQueue.length) {
    requestIdleCallback(FiberLoop);
  } else {
    // 说明任务完成，应该挂载真实节点到文档中。
    if (rootDOM && containerDOM) containerDOM.appendChild(rootDOM);
  }
};
/**
 * @param {Element} container 根容器，一个 DOM 节点
 * @param {ReactCreateRootOptionsType} options 配置对象 可选
 * @returns {ReactRootType} 返回一个 react 根节点，包含 render 与 unmount 属性
 */
export const createRoot = (
  container: Element,
  options?: ReactCreateRootOptionsType,
): ReactRootType => {
  return {
    render: (element: ReactElement) => {
      // 移除 react 根容器中原本的节点
      [...container.childNodes].forEach((item) => item.remove());
      if (!element) return;
      // 放置根节点
      levelFiberQueue.push({
        vdom: element as MyReactNodeType,
        parent: null,
      });
      containerDOM = container;
      // 执行任务调度机制，
      requestIdleCallback(FiberLoop);
    },
    unmount: () => {},
  };
};
