import { Router } from "express";
import { LinearData } from "../models/linearDataModel";
import { buildTree, convertToTree, TreeNode } from "../utils/convertToTree";

const router = Router();

router.get("/", async (_, res) => {
  try {
    // Fetch all linear data where name does not include " > "
    const linearData = await LinearData.find({
      name: { $not: / > / }, // Regular expression to exclude names containing " > "
    }).select("name size");

    // Log the fetched linear data

    // Build the tree structure from the linear data
    const tree = buildTree(linearData);

    // Log the tree structure

    // Send the response with the complete tree structure
    return res.status(200).send({
      data: tree, // Return the entire tree structure
    });
  } catch (err) {
    console.error("Error fetching main nodes:", err);
    return res.status(500).send(err);
  }
});

router.get("/children", async (req, res) => {
  const parentName = req.query.parentName as string;

  try {
    // Create regex to match only direct children
    const regexPattern = `^${parentName} > [^>]+$`; // Match names like 'parentName > childName'

    // Fetch direct children from the database
    const children = await LinearData.find({
      name: { $regex: regexPattern, $options: "i" }, // Use case-insensitive matching
    }).select("name size");

    // Map the results to a simpler structure if needed
    const filteredChildren = children.map((child) => ({
      name: child.name,
      size: child.size,
    }));

    return res.status(200).send({
      data: filteredChildren,
    });
  } catch (err) {
    console.error("Error fetching children:", err);
    return res.status(500).send(err);
  }
});

export default router;
