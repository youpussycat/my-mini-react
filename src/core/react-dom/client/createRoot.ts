import type {
  ReactRootType,
  ReactCreateRootOptionsType,
  MyReactNodeType,
  FiberUnitDataType,
  ReactElement,
  MyReactComponentType,
  DOMDataType,
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
 * @param {"all" | "diff"} type 表示是数据全都挂在还是根据旧 fiber 更新挂载 props
 */
const mountDOMProps = (
  dom: Element | Text,
  unitData: FiberUnitDataType,
  type: "all" | "diff" = "all",
  oldFiber?: FiberUnitDataType,
) => {
  if (type === "all") {
    // 全部挂载属性
    Object.keys(unitData.vdom.props).forEach((key) => {
      const value = unitData.vdom.props[key];
      // 剔除 children 属性
      if (key !== "children" && key.substring(0, 2) !== "on") dom[key] = value;
      else if (key.substring(0, 2) === "on") {
        dom.addEventListener(key.substring(2).toLocaleLowerCase(), value);
      }
    });
  } else {
    // 对比更改属性
    const oldProps = oldFiber!.vdom.props,
      newProps = unitData.vdom.props;
    Object.keys(newProps).forEach((key) => {
      if (newProps[key] !== oldProps[key] && unitData.dom) {
        if (key.substring(0, 2) !== "on")
          (unitData.dom as Element).setAttribute(key, newProps[key]);
        else {
          const eventType = key.substring(2).toLocaleLowerCase();
          (unitData.dom as Element).removeEventListener(
            eventType,
            oldProps[key],
          );
          (unitData.dom as Element).addEventListener(eventType, newProps[key]);
        }
      }
    });
    Object.keys(oldProps).forEach((key) => {
      if (!newProps[key])
        if (key.substring(0, 2) !== "on")
          (unitData.dom as Element).removeAttribute(key);
        else
          (unitData.dom as Element).removeEventListener(
            key.substring(2).toLocaleLowerCase(),
            oldProps[key],
          );
    });
  }
};
/**
 * @description 根据容器对应进行 DOMData 的数据初始化【原来有记录用原来的，没有则将当前的进行记录】
 * @param container 根容器
 * @param DOMData 根容器对应的任务调度所需数据
 */
const initMapData = (container, DOMData) => {
  if (containerWithGlobalData.has(container)) {
    const mapData = containerWithGlobalData.get(container)!;
    Object.assign(DOMData, mapData);
  } else {
    containerWithGlobalData.set(container, DOMData);
  }
};
/** 容器和对应数据的存储映射 */
const containerWithGlobalData = new WeakMap<Element, DOMDataType>();

/**
 * @description 塑造 fiber 框架
 * @param {FiberUnitDataType} firstFiber 第一个 fiber 数据
 * @param {Element} container 根容器
 * @returns {IdleRequestCallback} 一个用于在 requestIdleCallback 执行的任务调度
 */
const createWorkerFiber = (
  firstFiber: FiberUnitDataType,
  container: Element,
): IdleRequestCallback => {
  /** 任务调度队列所需要的各种数据 */
  const DOMData: DOMDataType = {
    levelFiberQueue: [],
    rootDOM: null,
    containerDOM: null,
    oldFiberQueue: [],
    creatingOldFiberArr: [],
  };
  initMapData(container, DOMData);
  // 放置根节点
  DOMData.levelFiberQueue.push(firstFiber);
  DOMData.containerDOM = container;
  /** 一个 fiber 任务 */
  const performUnitOfFiber = () => {
    // 根据队列获取当前任务数据
    /** 当前任务数据， 数据一定是虚拟节点 */
    const unitData: FiberUnitDataType = DOMData.levelFiberQueue[0];
    /** 要挂载在下一层 fiber 节点的 parent 属性上的真实 dom 节点 */
    let dom: Text | Element | null = null,
      /** 当前 fiber 节点的子节点 */
      children: MyReactNodeType["props"]["children"] | null = null;
    /** 是否是函数式组件 */
    const isFunctionCom = typeof unitData.vdom.type === "function";
    if (isFunctionCom) {
      debugger;
      // 若是函数组件，应该将 props 传入 type 获取下一层虚拟元素，
      // 同时将当前的真实的父 dom 作为子的父， 保证子可以挂载在正确的节点下
      children = (unitData.vdom.type as MyReactComponentType)(
        unitData.vdom.props,
      );
      dom = unitData.parent;
    } else {
      // 若是非函数组件，先拿到旧vdom与当前做对比
      const oldFiber = DOMData.oldFiberQueue[0];
      if (!oldFiber || oldFiber.vdom.type !== unitData.vdom.type) {
        // 若是 type 不一样，表示要创建新节点，会创建对应的真实 DOM 元素，然后进行挂载
        dom = createDOM(unitData.vdom); // 创建真实 dom 节点
        unitData.dom = dom;
        mountDOMProps(dom, unitData); // 挂载属性
        // 挂载真实 dom 到其父节点上
        if (unitData.parent) unitData.parent.appendChild(dom);
        else DOMData.rootDOM = dom;
      } else {
        // 更新 props
        mountDOMProps(oldFiber.dom, unitData, "diff", oldFiber);
      }
      children = unitData.vdom.props.children;
    }
    // 根据当前数据将子的 fiber 数据 push 到队列中
    // children 为 对象则 看是否为数组
    if (typeof children === "object") {
      // 若是有子节点，则一定是虚拟 dom 对象
      if (Array.isArray(children)) {
        children.forEach((vdom) => {
          DOMData.levelFiberQueue.push({
            vdom: vdom as MyReactNodeType,
            parent: dom as Element,
          });
        });
      } else {
        DOMData.levelFiberQueue.push({
          vdom: children!,
          parent: dom as Element,
        });
      }
    }
    // 删除 队列中的 当前 fiber 节点,将其记录在旧的队列中.
    DOMData.creatingOldFiberArr.push(DOMData.levelFiberQueue[0]);
    DOMData.levelFiberQueue.shift();
  };
  /** 任务调度机制： 空闲时间执行对应任务，空闲时间快结束时停止任务执行，剩余任务放置下一次执行 */
  const FiberLoop = (deadline: IdleDeadline) => {
    while (DOMData.levelFiberQueue.length) {
      // 挂载节点
      if (deadline.timeRemaining() < 1) {
        // 需要中断
        break;
      }
      // 执行任务
      performUnitOfFiber();
    }
    // 中断后等待空闲继续执行剩余任务
    if (DOMData.levelFiberQueue.length) {
      requestIdleCallback(FiberLoop);
    } else {
      // 说明任务完成，应该挂载真实节点到文档中。并将当前这次任务调度的 fiber 节点放在 oldFiberQueue
      if (DOMData.rootDOM && DOMData.containerDOM) {
        DOMData.containerDOM?.appendChild(DOMData.rootDOM);
        DOMData.oldFiberQueue = DOMData.creatingOldFiberArr;
        DOMData.creatingOldFiberArr = [];
      }
    }
  };
  return FiberLoop;
};

export const update = (container) => {
  const oldFiber = containerWithGlobalData.get(container)?.oldFiberQueue[0];
  const FiberLoop = createWorkerFiber(
    {
      vdom: oldFiber?.vdom!,
      parent: null,
    },
    container,
  );
  // 执行任务调度机制，
  requestIdleCallback(FiberLoop);
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
      if (containerWithGlobalData.has(container)) container.innerHTML = "";
      if (!element) return;

      const FiberLoop = createWorkerFiber(
        {
          vdom: element as MyReactNodeType,
          parent: null,
        },
        container,
      );
      // 执行任务调度机制，
      requestIdleCallback(FiberLoop);
    },
    unmount: () => {
      containerWithGlobalData.delete(container);
    },
    update: () => {
      update(container);
    },
  };
};
