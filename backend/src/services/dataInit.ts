import axios from "axios";
import sax from "sax";
import { Database } from "sqlite3";

export type TParsedData = {
  name: string;
  size: number;
  wnid?: string;
  gloss?: string;
};

export async function initializeData(db: Database): Promise<void> {
  try {
    console.time("Parsing Time");

    const parsedData = await fetchAndParseXMLData();

    console.timeEnd("Parsing Time");
    console.log("Node count:", parsedData.length);

    console.time("Saving Time");

    db.exec(`
        DROP TABLE IF EXISTS parsed_data;
        CREATE TABLE parsed_data (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          size INTEGER NOT NULL,
          wnid TEXT,
          gloss TEXT
        );
      `);
    db.exec("BEGIN TRANSACTION");

    const insertStmt = db.prepare(
      "INSERT INTO parsed_data (name, size, wnid, gloss) VALUES (?, ?, ?, ?)"
    );

    for (const item of parsedData) {
      insertStmt.run(item.name, item.size, item.wnid, item.gloss);
    }

    insertStmt.finalize();

    db.exec("COMMIT");

    console.timeEnd("Saving Time");
    console.log("Data saved to DB");
  } catch (error) {
    console.error("Error initializing data:", error);
  }
}

async function fetchAndParseXMLData(): Promise<TParsedData[]> {
  const url =
    "https://raw.githubusercontent.com/tzutalin/ImageNet_Utils/master/detection_eval_tools/structure_released.xml";

  const response = await axios.get(url, { responseType: "stream" });

  return new Promise((resolve, reject) => {
    const parser = sax.createStream(true, {});

    const stack: (TParsedData & { childCount?: number })[] = [];
    const result: TParsedData[] = [];

    parser.on("opentag", (node) => {
      if (node.name === "synset") {
        const words = node.attributes.words;
        const wnid = node.attributes.wnid;
        const glossAttr = node.attributes.gloss;

        const parent = stack.length > 0 ? stack[stack.length - 1] : null;
        const fullName = parent ? `${parent.name} > ${words}` : words;

        const currentNode: TParsedData & { childCount?: number } = {
          name: fullName as string,
          wnid: wnid as string,
          gloss: glossAttr as string,
          size: 0,
          childCount: 0,
        };

        stack.push(currentNode);
      }
    });

    parser.on("closetag", (name) => {
      if (name === "synset") {
        const currentNode = stack.pop();
        if (currentNode) {
          const totalDescendants =
            currentNode.size + (currentNode.childCount || 0);
          currentNode.size = totalDescendants;

          if (stack.length > 0) {
            const parentNode = stack[stack.length - 1];
            parentNode.childCount = (parentNode.childCount || 0) + 1;
            parentNode.size += currentNode.size;
          }

          delete currentNode.childCount;
          result.push(currentNode);
        }
      }
    });

    parser.on("error", (error) => {
      reject(error);
    });

    parser.on("end", () => {
      resolve(result);
    });

    response.data.pipe(parser);
  });
}
