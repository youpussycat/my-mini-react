import type {
  ReactRootType,
  ReactCreateRootOptionsType,
  MyReactNodeType,
} from "../../types/typing";

/**
 * @param {Element} container 根容器，一个 DOM 节点
 * @param {MyReactNodeType} element 要渲染的 react 元素
 * @description 会递归的渲染对应的 react 虚拟 dom 为真实 dom 但是性能不好
 */
function render(container: Element, element: MyReactNodeType) {
  // 渲染一个 react 组件时，会递归生成最底层的虚拟 dom 最后在进行组装渲染
  if (typeof element.type === "function") {
    render(container, element.type(element.props));
  } else {
    /** 生成真实 dom 【未挂载属性】 */
    const dom =
      element.type === "TEXT_ELEMENT" // 根据类型判断创建文本节点还是正常元素
        ? document.createTextNode("")
        : document.createElement(element.type);
    // 挂载属性
    Object.keys(element.props).forEach((key) => {
      // 剔除 children 属性
      if (key !== "children") dom[key] = element.props[key];
    });
    // children 为 对象则 看是否为数组， 数组则挨个挂载子节点到当前节点，否则直接挂载
    if (typeof element.props.children === "object") {
      if (Array.isArray(element.props.children)) {
        element.props.children.forEach((item) => render(container, item));
      } else {
        if (dom instanceof Element) render(dom, element.props.children);
      }
    }
    // 挂载当前节点到父节点
    container.appendChild(dom);
  }
}
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
      render(container, element);
    },
    unmount: () => {},
  };
};
