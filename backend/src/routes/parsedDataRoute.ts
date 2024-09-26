// import { Router } from "express";
// import { ParsedDataModel } from "../models/ParsedDataModel";
// import { buildTree, convertToTree, TreeNode } from "../utils/convertToTree";

// const router = Router();

// router.get("/", async (_, res) => {
//   try {
//     // Fetch all linear data where name does not include " > "
//     const linearData = await ParsedDataModel.find({
//       name: { $not: / > / }, // Regular expression to exclude names containing " > "
//     }).select("name size");

//     // Log the fetched linear data

//     // Build the tree structure from the linear data
//     const tree = buildTree(linearData);

//     // Log the tree structure

//     // Send the response with the complete tree structure
//     return res.status(200).send({
//       data: tree, // Return the entire tree structure
//     });
//   } catch (err) {
//     console.error("Error fetching main nodes:", err);
//     return res.status(500).send(err);
//   }
// });

// router.get("/children", async (req, res) => {
//   const parentName = req.query.parentName as string;

//   try {
//     // Create regex to match only direct children
//     const regexPattern = `^${parentName} > [^>]+$`; // Match names like 'parentName > childName'

//     // Fetch direct children from the database
//     const children = await ParsedDataModel.find({
//       name: { $regex: regexPattern, $options: "i" }, // Use case-insensitive matching
//     }).select("name size");

//     // Map the results to a simpler structure if needed
//     const filteredChildren = children.map((child) => ({
//       name: child.name,
//       size: child.size,
//     }));

//     return res.status(200).send({
//       data: filteredChildren,
//     });
//   } catch (err) {
//     console.error("Error fetching children:", err);
//     return res.status(500).send(err);
//   }
// });

// export default router;
// apiRouter.ts
import express from "express";
import { getDbConnection } from "../db/database";
import { buildTree } from "../utils/buildTree";

const router = express.Router();

// Helper function to escape SQLite special characters in LIKE queries
function escapeLikeString(str: string): string {
  return str.replace(/[%_]/g, "\\$&");
}

// GET "/"
router.get("/", (req, res) => {
  const db = getDbConnection();

  db.serialize(() => {
    // Fetch all linear data where name does not include " > "
    const sql = `SELECT name, size FROM parsed_data WHERE name NOT LIKE ? ESCAPE '\\'`;
    const params = [`%${escapeLikeString(" > ")}%`];

    db.all(sql, params, (err, rows) => {
      if (err) {
        console.error("Error fetching main nodes:", err);
        db.close();
        return res.status(500).send(err);
      }

      if (!rows || rows.length === 0) {
        db.close();
        return res.status(404).send({ error: "No data found" });
      }

      // Build the tree structure from the linear data
      const tree = buildTree(rows);

      // Send the response with the complete tree structure
      res.status(200).send({
        data: tree, // Return the entire tree structure
      });

      db.close();
    });
  });
});

// GET "/children"
router.get("/children", (req, res) => {
  const parentName = req.query.parentName as string;

  if (!parentName) {
    return res
      .status(400)
      .send({ error: "parentName query parameter is required" });
  }

  const db = getDbConnection();

  db.serialize(() => {
    // Create pattern to match only direct children
    const escapedParentName = escapeLikeString(parentName);
    const pattern = `${escapedParentName} > %`;
    const exclusionPattern = `${escapedParentName} > % > %`;

    const sql = `
      SELECT name, size FROM parsed_data
      WHERE name LIKE ? ESCAPE '\\' AND name NOT LIKE ? ESCAPE '\\'
    `;
    const params = [pattern, exclusionPattern];

    db.all(sql, params, (err, rows) => {
      if (err) {
        console.error("Error fetching children:", err);
        db.close();
        return res.status(500).send({ error: "Internal Server Error" });
      }

      // Map the results to a simpler structure if needed
      const filteredChildren = rows.map((child) => ({
        name: child.name,
        size: child.size,
      }));

      res.status(200).send({
        data: filteredChildren,
      });

      db.close();
    });
  });
});

export default router;
