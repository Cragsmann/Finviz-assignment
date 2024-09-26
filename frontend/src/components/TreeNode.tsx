// import axios from "axios";
// import { useState } from "react";

// export const TreeNodeComponent = ({ node }) => {
//   const [children, setChildren] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [isOpen, setIsOpen] = useState(false); // Track whether the node is expanded
//   const displayName = node.name.split(" > ").pop(); // Extract the last part of the name
//   const handleClick = async () => {
//     if (children.length === 0 && !loading) {
//       // Only fetch children if they haven't been loaded yet
//       setLoading(true);
//       try {
//         const response = await axios.get(
//           "http://localhost:3000/treeData/children",
//           {
//             params: { parentName: node.name },
//           }
//         );
//         setChildren(response.data.data);
//       } catch (error) {
//         console.error("Error loading children:", error);
//       } finally {
//         setLoading(false);
//       }
//     }
//     // Toggle the open state of the node
//     setIsOpen((prev) => !prev);
//   };

//   return (
//     <div>
//       <div
//         onClick={node.size > 0 ? handleClick : undefined}
//         style={{
//           cursor: node.size > 0 ? "pointer" : "default",
//           fontWeight: isOpen ? "bold" : "normal",
//           color: node.size > 0 ? "white" : "lightgray",
//         }}
//       >
//         {displayName} ({node.size})
//         {children.length > 0 && (isOpen ? " ▼" : null)}{" "}
//       </div>
//       {loading && <div>Loading...</div>}
//       {isOpen && children.length > 0 && (
//         <div style={{ paddingLeft: "20px" }}>
//           {children.map((child) => (
//             <TreeNodeComponent key={child.name} node={child} />
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };
import axios from "axios";
import { useState } from "react";

// Import icons (you might need to install these packages)
// npm install react-icons
import { FaFolder, FaFolderOpen, FaFile } from "react-icons/fa";

export const TreeNodeComponent = ({ node }) => {
  const [children, setChildren] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const isFolder = node.size > 0; // Assuming size > 0 indicates a folder

  const handleClick = async () => {
    if (isFolder) {
      if (!isOpen) {
        if (children.length === 0 && !loading) {
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
      }
      setIsOpen(!isOpen);
    }
  };

  const displayName = node.name.split(" > ").pop();

  return (
    <div>
      <div
        onClick={handleClick}
        style={{
          cursor: isFolder ? "pointer" : "default",
          display: "flex",
          alignItems: "center",
          color: "white",
        }}
      >
        {isFolder ? (
          isOpen ? (
            <FaFolderOpen style={{ marginRight: 5, color: "#ddc" }} />
          ) : (
            <FaFolder style={{ marginRight: 5, color: "#ddc" }} />
          )
        ) : (
          <FaFile style={{ marginRight: 5, color: "#ddf" }} />
        )}
        <span>
          {displayName} ({node.size})
        </span>
      </div>
      {loading && <div style={{ marginLeft: 20 }}>Loading...</div>}
      {isOpen && children.length > 0 && (
        <div style={{ marginLeft: 20 }}>
          {children.map((child) => (
            <TreeNodeComponent key={child.name} node={child} />
          ))}
        </div>
      )}
    </div>
  );
};
