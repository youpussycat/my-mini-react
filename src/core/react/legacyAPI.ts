import type {
  MyReactNodeType,
  MyReactNodeChildType,
} from "../types/typing.d.ts";
export const createElement = (
  type: MyReactNodeType["type"],
  props: MyReactNodeType["props"],
  ...children: MyReactNodeChildType[]
) => {
  const result: MyReactNodeType = {
    type,
    props: props
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
    key: props.key || null,
    ref: props.ref || null,
  };
  if (children.length)
    result.props.children = children.length > 1 ? children : children[0];
  return result;
};
