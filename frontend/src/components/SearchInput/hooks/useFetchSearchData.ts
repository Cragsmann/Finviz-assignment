import { useState, useCallback, useMemo, useEffect } from "react";
import axios from "axios";
import { debounce } from "lodash";
import { TTreeData } from "../../../@types/treeData";

export const useFetchSearchData = () => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<TTreeData[]>([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const fetchSuggestions = useCallback(async (searchTerm: string) => {
    if (!searchTerm.trim()) {
      setSuggestions([]);
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
      setSuggestions(response.data.data);
      setShowDropdown(true);
    } catch (error) {
      console.error("Error fetching search results:", error);
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const debouncedSearch = useMemo(
    () => debounce(fetchSuggestions, 500),
    [fetchSuggestions]
  );

  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    setQuery(newQuery);
    if (newQuery.length < 3) {
      setSuggestions([]);
      setShowDropdown(false);
      return;
    }

    debouncedSearch(newQuery);
  };

  return {
    query,
    setQuery,
    suggestions,
    loading,
    showDropdown,
    setShowDropdown,
    handleInputChange,
  };
};
