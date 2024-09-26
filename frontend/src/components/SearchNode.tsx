// SearchComponent.jsx
import React, { useState } from "react";
import axios from "axios";
import { TreeNodeComponent } from "./TreeNode";

export const SearchNode = () => {
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    setQuery(e.target.value);
  };

  const handleSearch = async (e) => {
    e.preventDefault();

    if (!query.trim()) {
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get(
        "http://localhost:3000/treeData/search",
        {
          params: { q: query },
        }
      );
      setSearchResults(response.data.data);
    } catch (error) {
      console.error("Error fetching search results:", error);
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSearch} style={{ marginBottom: "20px" }}>
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          placeholder="Search..."
          style={{ padding: "5px", width: "200px" }}
        />
        <button
          type="submit"
          style={{ padding: "5px 10px", marginLeft: "5px" }}
        >
          Search
        </button>
      </form>

      {loading && <div>Loading search results...</div>}

      {!loading && searchResults.length > 0 && (
        <div>
          <h3>Search Results:</h3>
          {searchResults.map((node) => (
            <TreeNodeComponent key={node.name} node={node} />
          ))}
        </div>
      )}

      {!loading && searchResults.length === 0 && query && (
        <div>No results found for "{query}"</div>
      )}
    </div>
  );
};
