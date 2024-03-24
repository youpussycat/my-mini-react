import type {
  ReactRootType,
  ReactCreateRootOptionsType,
  MyReactNodeType,
  FiberUnitDataType,
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
    render: (element: MyReactNodeType) => {
      // 移除 react 根容器中原本的节点
      [...container.childNodes].forEach((item) => item.remove());
      // 塑造 fiber 框架
      /** 任务调度队列 */
      let levelFiberQueue: FiberUnitDataType[] = [],
        /** 虚拟根节点节点对应的真实节点, fiber 节点中若是 parent 为 null 则是根结点 */
        rootDOM: Text | Element | null = null;
      /** 一个 fiber 任务 */
      const performUnitOfFiber = () => {
        // 根据队列获取当前任务数据
        /** 当前任务数据 */
        const unitData: FiberUnitDataType = levelFiberQueue[0];
        /** 该 fiber 节点对应的真实 DOM 节点 */
        const dom = createDOM(unitData.vdom); // 创建真实 dom 节点
        mountDOMProps(dom, unitData.vdom); // 挂载属性
        // 挂载真实 dom 到其父节点上
        if (unitData.parent) unitData.parent.appendChild(dom);
        else rootDOM = dom;
        // 根据当前数据将子的 fiber 数据 push 到队列中
        const children = unitData.vdom.props.children;
        // children 为 对象则 看是否为数组
        if (typeof children === "object") {
          // 若是有子节点，则一定是虚拟 dom 对象
          if (Array.isArray(children)) {
            children.forEach((vdom) =>
              levelFiberQueue.push({ vdom, parent: dom as Element }),
            );
          } else {
            levelFiberQueue.push({ vdom: children, parent: dom as Element });
          }
        }
        // 删除 队列中的 当前 fiber 节点
        levelFiberQueue.shift();
        return null;
      };
      /** 任务循环执行机制 */
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
          if (rootDOM) container.appendChild(rootDOM);
        }
      };

      /**
       * @param {Element} container 根容器，一个 DOM 节点
       * @param {MyReactNodeType} element 要渲染的 react 元素
       * @description 渲染对应的 react 虚拟 dom 为真实 dom 但是无法处理函数式组件
       */
      const render = (container: Element, element: MyReactNodeType) => {
        levelFiberQueue.push({
          vdom: element,
          parent: null,
        });
        requestIdleCallback(FiberLoop);
        // // 渲染一个 react 组件时，会递归生成最底层的虚拟 dom 最后在进行组装渲染
        // if (typeof element.type === "function") {
        //   render(container, element.type(element.props));
        // }
      };
      render(container, element);
    },
    unmount: () => {},
  };
};
