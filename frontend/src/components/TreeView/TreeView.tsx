import { useFetchInitData } from "./hooks/useFetchInitData";
import { SearchInput } from "../SearchInput/SearchInput";
import { TreeNode } from "../TreeNode/TreeNode";
import "./TreeView.css";

const TreeView = () => {
  const { data, loading } = useFetchInitData();

  if (loading)
    return (
      <div className="loading">
        <p>Loading...</p>
      </div>
    );

  return (
    <div className="container">
      <header className="header">
        <h1 className="title">Tree Viewer</h1>
        <SearchInput />
      </header>
      <main className="main-content">
        {data.map((node) => (
          <TreeNode key={node.name} node={node} />
        ))}
      </main>
    </div>
  );
};

export default TreeView;
