import { Database } from "sqlite3";
import { getDbConnection } from "../db/database";
import { escapeLikeString } from "../utils/utils";
import { TTreeImageData } from "../@types/types";

export const fetchMainNodes = (): Promise<TTreeImageData[]> => {
  return new Promise((resolve, reject) => {
    const db: Database = getDbConnection();

    const sql = `
      SELECT name, size, wnid FROM parsed_data
      WHERE name NOT LIKE ? ESCAPE '\\'
      ORDER BY name COLLATE NOCASE
    `;
    const params = [`%${escapeLikeString(" > ")}%`];

    db.all<TTreeImageData>(sql, params, (err, rows) => {
      db.close();

      if (err) {
        console.error("Error fetching main nodes:", err);
        return reject(err);
      }

      resolve(rows || []);
    });
  });
};

export const fetchChildren = (
  parentName: string
): Promise<TTreeImageData[]> => {
  return new Promise((resolve, reject) => {
    const db: Database = getDbConnection();

    const escapedParentName = escapeLikeString(parentName);
    const pattern = `${escapedParentName} > %`;
    const exclusionPattern = `${escapedParentName} > % > %`;

    const sql = `
      SELECT name, size, wnid FROM parsed_data
      WHERE name LIKE ? ESCAPE '\\' AND name NOT LIKE ? ESCAPE '\\'
      ORDER BY name COLLATE NOCASE
    `;
    const params = [pattern, exclusionPattern];

    db.all<TTreeImageData>(sql, params, (err, rows) => {
      db.close();

      if (err) {
        console.error("Error fetching children:", err);
        return reject(err);
      }

      resolve(rows || []);
    });
  });
};

export const searchNodes = (query: string): Promise<TTreeImageData[]> => {
  return new Promise((resolve, reject) => {
    const db: Database = getDbConnection();

    const escapedQuery = escapeLikeString(query);
    const pattern = `%${escapedQuery}%`;

    const sql = `
      SELECT name, size, wnid FROM parsed_data
      WHERE name LIKE ? ESCAPE '\\'
      ORDER BY name COLLATE NOCASE
    `;
    const params = [pattern];

    db.all<TTreeImageData>(sql, params, (err, rows) => {
      db.close();

      if (err) {
        console.error("Error executing search query:", err);
        return reject(err);
      }

      resolve(rows || []);
    });
  });
};
