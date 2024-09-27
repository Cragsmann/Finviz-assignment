import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { TTreeData } from "../@types/treeData";

export const useFetchInitData = () => {
  const [data, setData] = useState<TTreeData[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchInitialData = useCallback(async () => {
    try {
      const response = await axios.get("http://localhost:3000/treeData");
      setData(response.data.data);
    } catch (error) {
      console.error("Error loading tree data:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  return { data, loading };
};
