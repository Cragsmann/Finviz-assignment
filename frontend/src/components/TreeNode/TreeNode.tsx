import { FaFile, FaFolder, FaFolderOpen } from "react-icons/fa";
import { useFetchTreeChildren } from "../../hooks/useFetchTreeChildren";
import "./TreeNode.css";
import { TTreeData } from "../../@types/treeData";

export const TreeNode = ({ node }: { node: TTreeData }) => {
  const { isFolder, treeChildren, loading, isOpen, handleClick } =
    useFetchTreeChildren(node);

  const displayName = node.name.split(" > ").pop();

  return (
    <div className="tree-node">
      <div
        onClick={handleClick}
        className={`node-label ${isFolder ? "folder" : "file"} ${
          isOpen ? "open" : ""
        }`}
      >
        {isFolder ? (
          isOpen ? (
            <FaFolderOpen className="tree-icon" />
          ) : (
            <FaFolder className="tree-icon" />
          )
        ) : (
          <FaFile className="tree-icon" />
        )}
        <span>{displayName}</span>
      </div>
      {loading && <div className="loading">Loading...</div>}
      {isOpen && treeChildren.length > 0 && (
        <div className="children">
          {treeChildren.map((child, i) => (
            <TreeNode key={`${child.name + i}`} node={child} />
          ))}
        </div>
      )}
    </div>
  );
};
