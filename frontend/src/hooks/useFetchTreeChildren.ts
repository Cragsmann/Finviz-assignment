import axios from "axios";
import { useState } from "react";
import { TTreeData } from "../@types/treeData";

export const useFetchTreeChildren = (node: TTreeData) => {
  const [treeChildren, setTreeChildren] = useState<TTreeData[]>([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const isFolder = node.size > 0;

  const handleClick = async () => {
    if (isFolder) {
      if (!isOpen && treeChildren.length === 0 && !loading) {
        setLoading(true);
        try {
          const response = await axios.get(
            "http://localhost:3000/treeData/children",
            {
              params: { parentName: node.name },
            }
          );
          setTreeChildren(response.data.data);
        } catch (error) {
          console.error("Error loading children:", error);
        } finally {
          setLoading(false);
        }
      }
      setIsOpen(!isOpen);
    }
  };

  return {
    isFolder,
    treeChildren,
    loading,
    isOpen,
    handleClick,
  };
};
