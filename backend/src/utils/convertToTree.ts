import { TLinearData } from "../services/dataInitializer";

export type TreeNode = {
  name: string;
  size: number;
  children?: TreeNode[];
};

// Function to build a tree structure from the linear data
// export function buildTree(linearData: TLinearData[]): TreeNode[] {
//   const tree: TreeNode[] = [];
//   const map: { [key: string]: TreeNode } = {};

//   linearData.forEach((item) => {
//     const newNode: TreeNode = { ...item, children: [] };
//     map[item.name] = newNode;

//     if (item.name.includes(" > ")) {
//       const parentName = item.name.split(" > ").slice(0, -1).join(" > ");
//       if (map[parentName]) {
//         map[parentName].children.push(newNode);
//       }
//     } else {
//       tree.push(newNode); // Add root nodes
//     }
//   });

//   return tree;
// }
interface TreeNode {
  id: string; // Add id to track the node's unique identifier
  name: string;
  size: number;
  children: TreeNode[];
}

export function buildTree(data: any[]): TreeNode[] {
  const map: { [key: string]: TreeNode } = {};
  const roots: TreeNode[] = [];

  data.forEach((item) => {
    // Extract the relevant fields from the Mongoose document
    const id = item._id.toString(); // Ensure id is a string
    const name = item.name;
    const size = item.size;

    const node: TreeNode = {
      id: id,
      name: name,
      size: size,
      children: [],
    };

    // Store the node in the map
    map[id] = node;

    // Determine if it's a root node (no parent)
    if (!name.includes(" > ")) {
      // It's a root node, add to the roots array
      roots.push(node);
    } else {
      // Otherwise, find the parent node and add this node to its children
      const parentName = name.substring(0, name.lastIndexOf(" > "));
      const parentNode = Object.values(map).find((n) => n.name === parentName);

      if (parentNode) {
        parentNode.children.push(node);
      }
    }
  });

  return roots;
}
