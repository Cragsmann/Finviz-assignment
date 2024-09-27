import { TTreeImageData } from "../models/imageTreeModel";

type TreeNode = TTreeImageData & {
  children: TreeNode[];
};

export function buildTree(
  data: Array<{ name: string; size: number; wnid: string }>
): TreeNode[] {
  const nodeMap: { [path: string]: TreeNode } = {};

  data.forEach((item) => {
    const parts = item.name.split(" > ");
    let path = "";
    let parentNode: TreeNode | null = null;

    parts.forEach((part, index) => {
      path = path ? `${path} > ${part}` : part;

      if (!nodeMap[path]) {
        const node: TreeNode = {
          name: part,
          size: 0,
          wnid: item.wnid,
          children: [],
        };
        nodeMap[path] = node;

        if (parentNode) {
          parentNode.children.push(node);
        }
      }

      parentNode = nodeMap[path];

      if (index === parts.length - 1) {
        parentNode.size = item.size;
      }
    });
  });

  return Object.values(nodeMap);
}
