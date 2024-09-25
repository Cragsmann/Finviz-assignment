import axios from "axios";
import { useState } from "react";

export const TreeNodeComponent = ({ node }) => {
  const [children, setChildren] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false); // Track whether the node is expanded
  const displayName = node.name.split(" > ").pop(); // Extract the last part of the name
  const handleClick = async () => {
    if (children.length === 0 && !loading) {
      // Only fetch children if they haven't been loaded yet
      setLoading(true);
      try {
        const response = await axios.get(
          "http://localhost:3000/treeData/children",
          {
            params: { parentName: node.name },
          }
        );
        setChildren(response.data.data);
      } catch (error) {
        console.error("Error loading children:", error);
      } finally {
        setLoading(false);
      }
    }
    // Toggle the open state of the node
    setIsOpen((prev) => !prev);
  };

  return (
    <div>
      <div
        onClick={node.size > 0 ? handleClick : undefined} // Set click handler conditionally
        style={{
          cursor: node.size > 0 ? "pointer" : "default", // Change cursor based on size
          fontWeight: isOpen ? "bold" : "normal",
          color: node.size > 0 ? "white" : "lightgray", // Change color based on size
        }}
      >
        {displayName} ({node.size})
        {children.length > 0 && (isOpen ? " ▲" : " ▼")}{" "}
        {/* Indicate expand/collapse */}
      </div>
      {loading && <div>Loading...</div>}
      {isOpen && children.length > 0 && (
        <div style={{ paddingLeft: "20px" }}>
          {children.map((child) => (
            <TreeNodeComponent key={child.name} node={child} />
          ))}
        </div>
      )}
    </div>
  );
};
