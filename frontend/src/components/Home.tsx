import { useEffect, useState } from "react";
import axios from "axios";
import { TreeNodeComponent } from "./TreeNode"; // Adjust the import based on your file structure
import { SearchNode } from "./SearchNode";

const TreeView = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:3000/treeData");
        setData(response.data.data);
      } catch (error) {
        console.error("Error loading tree data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div style={{ display: "flex" }}>
      {data.map((node) => (
        <TreeNodeComponent key={node.name} node={node} />
      ))}
      <SearchNode />
    </div>
  );
};

export default TreeView;
