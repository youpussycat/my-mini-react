/**
 * @description 根据文本生成虚拟 dom 文本节点
 * @param {string} text 文本
 * @returns {MyReactNodeType} 虚拟 dom
 */
export const createTextNode = (text: string) => {
  return {
    type: "TEXT_ELEMENT",
    props: {
      nodeValue: text,
      children: [],
    },
  };
};
