import { Request, Response } from "express";
import {
  fetchMainNodes,
  fetchChildren,
  searchNodes,
  TTreeImageData,
} from "../models/imageTreeModel";

export const getMainNodes = async (_req: Request, res: Response) => {
  try {
    const data: TTreeImageData[] = await fetchMainNodes();

    if (data.length === 0) {
      return res.status(404).json({ error: "No data found" });
    }

    res.status(200).json({ data });
  } catch (error) {
    console.error("Error fetching main nodes:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getChildren = async (req: Request, res: Response) => {
  const parentName = req.query.parentName as string;

  if (!parentName) {
    return res
      .status(400)
      .json({ error: "parentName query parameter is required" });
  }

  try {
    const data: TTreeImageData[] = await fetchChildren(parentName);

    if (data.length === 0) {
      return res.status(404).json({ error: "No data found" });
    }

    res.status(200).json({ data });
  } catch (error) {
    console.error("Error fetching children:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const search = async (req: Request, res: Response) => {
  const query = req.query.searchTerm as string;

  if (!query || query.length < 3) {
    return res
      .status(400)
      .json({ error: "Search term with minimum 3 characters is required" });
  }

  try {
    const data: TTreeImageData[] = await searchNodes(query);

    res.status(200).json({ data });
  } catch (error) {
    console.error("Error executing search query:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
