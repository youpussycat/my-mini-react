import type {
  MyReactNodeType,
  MyReactNodeChildType,
} from "../types/typing.d.ts";
import { createTextNode } from "./util.ts";
/**
 * @description 根据类型,props.children，创建对应的虚拟 dom
 * @param {MyReactNodeType["type"]} type 虚拟 dom 的类型
 * @param {MyReactNodeType["props"]} props 虚拟 dom 的 props
 * @param {MyReactNodeChildType[]} ...children 虚拟 dom 的子节点
 * @returns {MyReactNodeType} 虚拟 dom
 */
export const createElement = (
  type: MyReactNodeType["type"],
  props: MyReactNodeType["props"],
  ...children: MyReactNodeChildType[]
) => {
  /** 最终的虚拟 dom 对象 */
  const result: MyReactNodeType = {
    type,
    props: props // 存在则去除 key 和 ref 若是 key 不为字符串或是 number 则报错，反之为空的对象
      ? Object.keys(props).reduce((res, b) => {
          if (!["key", "ref"].includes(b)) res[b] = props[b];
          else if (
            b === "key" &&
            !["number", "string"].includes(typeof props[b])
          )
            throw new Error("key should be a number or a string");
          return res;
        }, {})
      : {},
    key: props?.key || null,
    ref: props?.ref || null,
  };
  if (children.length) {
    // 有子节点 挨个将子节点中的字符串转为文本虚拟节点 之后挂载到 props 的 children 中
    const trasform = (item) =>
      typeof item === "string" ? createTextNode(item) : item;
    result.props.children =
      children.length > 1
        ? children.map((item) => trasform(item))
        : trasform(children[0]);
  }
  return result;
};
