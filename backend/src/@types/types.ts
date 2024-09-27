export type TTreeImageData = {
  name: string;
  size: number;
  wnid?: string;
  gloss?: string;
};

export type TreeNode = TTreeImageData & {
  children: TreeNode[];
};
