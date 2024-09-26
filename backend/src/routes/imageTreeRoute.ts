import express, { Request, Response } from "express";
import { getDbConnection } from "../db/database";
import { escapeLikeString } from "../utils/utils";
import { Database } from "sqlite3";

const router = express.Router();

type RowData = {
  name: string;
  size: number;
  wnid: string;
};

router.get("/", (_: Request, res: Response) => {
  const db: Database = getDbConnection();

  db.serialize(() => {
    const sql = `SELECT name, size, wnid FROM parsed_data WHERE name NOT LIKE ? ESCAPE '\\'`;
    const params = [`%${escapeLikeString(" > ")}%`];

    db.all<RowData>(sql, params, (err: Error | null, rows?: RowData[]) => {
      if (err) {
        console.error("Error fetching main nodes:", err);
        db.close();
        return res.status(500).send({ error: "Internal Server Error" });
      }

      if (!rows || rows.length === 0) {
        db.close();
        return res.status(404).send({ error: "No data found" });
      }

      const queryData = rows.map((row) => ({
        name: row.name,
        size: row.size,
        wnid: row.wnid,
      }));

      res.status(200).send({
        data: queryData,
      });

      db.close();
    });
  });
});

router.get("/children", (req: Request, res: Response) => {
  const parentName = req.query.parentName as string;

  if (!parentName) {
    return res
      .status(400)
      .send({ error: "parentName query parameter is required" });
  }

  const db: Database = getDbConnection();

  db.serialize(() => {
    const escapedParentName = escapeLikeString(parentName);
    const pattern = `${escapedParentName} > %`;
    const exclusionPattern = `${escapedParentName} > % > %`;

    const sql = `
      SELECT name, size, wnid FROM parsed_data
      WHERE name LIKE ? ESCAPE '\\' AND name NOT LIKE ? ESCAPE '\\'
    `;
    const params = [pattern, exclusionPattern];

    db.all<RowData>(sql, params, (err: Error | null, rows?: RowData[]) => {
      if (err) {
        console.error("Error fetching children:", err);
        db.close();
        return res.status(500).send({ error: "Internal Server Error" });
      }

      if (!rows) {
        db.close();
        return res.status(404).send({ error: "No data found" });
      }

      const filteredChildren = rows.map((child) => ({
        name: child.name,
        size: child.size,
        wnid: child.wnid,
      }));

      res.status(200).send({
        data: filteredChildren,
      });

      db.close();
    });
  });
});

router.get("/search", (req: Request, res: Response) => {
  const query = req.query.searchTerm as string;

  if (!query) {
    return res.status(400).send({ error: "Search term is required" });
  }

  const db: Database = getDbConnection();

  db.serialize(() => {
    const escapedQuery = escapeLikeString(query);

    const pattern = `%${escapedQuery}%`;

    const sql = `
      SELECT name, size, wnid FROM parsed_data
      WHERE name LIKE ? ESCAPE '\\'
    `;
    const params = [pattern];

    db.all<RowData>(sql, params, (err: Error | null, rows?: RowData[]) => {
      if (err) {
        console.error("Error executing search query:", err);
        db.close();
        return res.status(500).send({ error: "Internal Server Error" });
      }

      if (!rows || rows.length === 0) {
        db.close();
        return res.status(404).send({ error: "No matching results found" });
      }

      res.status(200).send({
        data: rows,
      });

      db.close();
    });
  });
});

export default router;
