import axios from "axios";
import { ParsedDataModel } from "../models/ParsedDataModel";
import sax from "sax";
import sqlite3 from "sqlite3";

// function parseElement(element: any, parentName = ""): TParsedData[] {
//   const stack: { element: any; parentName: string }[] = [
//     { element, parentName },
//   ];
//   const result: TParsedData[] = [];

//   while (stack.length > 0) {
//     const { element, parentName } = stack.pop()!;
//     const name = element["$"]["words"];
//     const fullName = parentName ? `${parentName} > ${name}` : name;

//     const currentNode: TParsedData = { name: fullName, size: 0 };

//     if (element.synset) {
//       currentNode.size = element.synset.length;

//       element.synset.forEach((child) => {
//         stack.push({ element: child, parentName: fullName });
//       });
//     }

//     result.push(currentNode);
//   }

//   return result;
// }
// // Fetch the XML, parse it, and transform it
// export async function fetchAndParseImageNet(): Promise<TParsedData[]> {
//   try {
//     const url =
//       "https://raw.githubusercontent.com/tzutalin/ImageNet_Utils/master/detection_eval_tools/structure_released.xml";
//     const response = await axios.get(url);
//     const xmlData = await XML(response.data);
//     const root = xmlData.ImageNetStructure.synset;

//     const linearData: TParsedData[] = root.flatMap((element: any) =>
//       parseElement(element)
//     );

//     return linearData;
//   } catch (error) {
//     console.error("Error fetching or parsing XML data:", error);
//     throw error;
//   }
// }

// export async function fetchAndParseImageNet(): Promise<TParsedData[]> {
//   try {
//     const url =
//       "https://raw.githubusercontent.com/tzutalin/ImageNet_Utils/master/detection_eval_tools/structure_released.xml";
//     const response = await axios.get(url);
//     const parser = new XMLParser({
//       ignoreAttributes: false,
//       attributeNamePrefix: "",
//     });

//     const xmlData = parser.parse(response.data);
//     const root = xmlData.ImageNetStructure.synset;

//     const linearData: TParsedData[] = parseElement(root);

//     return linearData;
//   } catch (error) {
//     console.error("Error fetching or parsing XML data:", error);
//     throw error;
//   }
// }

// function parseElement(element: any, parentName = ""): TParsedData[] {
//   const stack: { element: any; parentName: string }[] = [
//     { element, parentName },
//   ];
//   const result: TParsedData[] = [];

//   while (stack.length > 0) {
//     const { element, parentName } = stack.pop()!;
//     const name = element.words;
//     const fullName = parentName ? `${parentName} > ${name}` : name;

//     const currentNode: TParsedData = { name: fullName, size: 0 };

//     if (element.synset) {
//       const children = Array.isArray(element.synset)
//         ? element.synset
//         : [element.synset];
//       currentNode.size = children.length;

//       children.forEach((child) => {
//         stack.push({ element: child, parentName: fullName });
//       });
//     }

//     result.push(currentNode);
//   }

//   return result;
// }

export async function fetchAndParseImageNet(): Promise<TParsedData[]> {
  try {
    const url =
      "https://raw.githubusercontent.com/tzutalin/ImageNet_Utils/master/detection_eval_tools/structure_released.xml";

    const response = await axios.get(url, { responseType: "stream" });

    return await parseXMLStream(response.data);
  } catch (error) {
    console.error("Error fetching or parsing XML data:", error);
    throw error;
  }
}

export type TParsedData = {
  name: string;
  size: number;
  wnid?: string;
  gloss?: string;
};

function parseXMLStream(stream: NodeJS.ReadableStream): Promise<TParsedData[]> {
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
          size: 0,
          childCount: 0,
        };

        if (glossAttr) {
          currentNode.gloss = glossAttr as string;
        }

        stack.push(currentNode);
      }
    });

    parser.on("closetag", (name) => {
      if (name === "synset") {
        const currentNode = stack.pop();
        if (currentNode) {
          // Veľkosť uzla je súčet veľkostí detí + počet priamych detí
          const totalDescendants =
            currentNode.size + (currentNode.childCount || 0);

          // Aktualizujeme size aktuálneho uzla
          currentNode.size = totalDescendants;

          // Ak existuje rodič, aktualizujeme jeho size a childCount
          if (stack.length > 0) {
            const parentNode = stack[stack.length - 1];

            // Zvýšime počet priamych detí rodiča
            parentNode.childCount = (parentNode.childCount || 0) + 1;

            // Pripočítame celkový počet potomkov aktuálneho uzla k veľkosti rodiča
            parentNode.size += currentNode.size;
          }

          // Odstránime interný childCount pred pridaním do výsledku
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

    stream.pipe(parser);
  });
}

export const initDataFetch = async (): Promise<void> => {
  try {
    console.time("Parsing Time");

    const linearData = await fetchAndParseImageNet();
    console.timeEnd("Parsing Time");
    console.log("Total number of nodes:", linearData.length);

    console.time("Saving Time");

    // Open (or create) the SQLite database
    const db = await open({
      filename: "./db/parsedData.db",
      driver: sqlite3.Database,
    });

    // Create the table
    await db.exec(`
      DROP TABLE IF EXISTS parsed_data;
      CREATE TABLE parsed_data (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        size INTEGER NOT NULL,
        wnid TEXT,
        gloss TEXT
      );
    `);

    // Begin a transaction
    await db.exec("BEGIN TRANSACTION");

    // Prepare the insert statement
    const insertStmt = await db.prepare(
      "INSERT INTO parsed_data (name, size, wnid, gloss) VALUES (?, ?, ?, ?)"
    );

    // Use a loop to insert data
    for (const item of linearData) {
      await insertStmt.run(item.name, item.size, item.wnid, item.gloss);
    }

    // Finalize the statement
    await insertStmt.finalize();

    // Commit the transaction
    await db.exec("COMMIT");

    console.timeEnd("Saving Time");
    console.log("Data saved to SQLite database");

    // Close the database
    await db.close();
  } catch (error) {
    console.error("Error fetching or processing data:", error);
  }
};

// export const initDataFetch = async (): Promise<void> => {
//   try {
//     await ParsedDataModel.deleteMany({});
//     console.time("Parsing Time");

//     const linearData = await fetchAndParseImageNet();
//     console.timeEnd("Parsing Time");
//     console.log("Total number of nodes:", linearData.length);

//     console.time("Saving Time");

//     const BATCH_SIZE = 1000; // Adjust the batch size as needed
//     const batches = [];
//     for (let i = 0; i < linearData.length; i += BATCH_SIZE) {
//       const batch = linearData.slice(i, i + BATCH_SIZE);
//       batches.push(batch);
//     }

//     for (let i = 0; i < batches.length; i++) {
//       await ParsedDataModel.insertMany(batches[i], { ordered: false });
//       console.log(`Inserted batch ${i + 1} of ${batches.length}`);
//     }

//     console.timeEnd("Saving Time");
//     console.log("Data saved to MongoDB");

//     // Create indexes after data insertion
//     console.time("Index Creation Time");
//     await ParsedDataModel.syncIndexes();
//     console.timeEnd("Index Creation Time");
//     console.log("Indexes created");
//   } catch (error) {
//     console.error("Error fetching or processing data:", error);
//   }
// };
