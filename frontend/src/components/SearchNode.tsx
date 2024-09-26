import { useState } from "react";
import axios from "axios";
import { debounce } from "lodash";
import { TreeNodeComponent } from "./TreeNode";

export const SearchNode = () => {
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const debouncedSearch = debounce(async (searchTerm) => {
    if (!searchTerm.trim()) {
      setSearchResults([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get(
        "http://localhost:3000/treeData/search",
        {
          params: { searchTerm },
        }
      );
      setSearchResults(response.data.data);
    } catch (error) {
      console.error("Error fetching search results:", error);
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  }, 500);

  const handleInputChange = (e) => {
    const newQuery = e.target.value;
    setQuery(newQuery);
    debouncedSearch(newQuery);
  };

  return (
    <div>
      <div style={{ marginBottom: "20px" }}>
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          placeholder="Search..."
          style={{ padding: "5px", width: "200px" }}
        />
      </div>

      {loading && <div>Loading search results...</div>}

      {!loading && searchResults.length > 0 && (
        <div>
          <h3>Search Results:</h3>
          {searchResults.map((node) => (
            <TreeNodeComponent key={node.name} node={node} />
          ))}
        </div>
      )}

      {!loading && searchResults.length === 0 && query.trim() && (
        <div>No results found for "{query}"</div>
      )}
    </div>
  );
};
