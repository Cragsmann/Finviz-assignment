import axios from "axios";
import { parseStringPromise } from "xml2js";
import { LinearData } from "../models/linearDataModel";

export type TLinearData = {
  name: string;
  size: number;
};

function parseElement(element: any, parentName = ""): TLinearData[] {
  const name = element["$"]["words"];
  const fullName = parentName ? `${parentName} > ${name}` : name;

  // Initialize the current node
  const currentNode: TLinearData = { name: fullName, size: 0 };

  // Check for children and parse them recursively
  if (element.synset) {
    const children: TLinearData[] = [];

    element.synset.forEach((child: any) => {
      const childElements = parseElement(child, fullName);
      children.push(...childElements); // Collect all children
    });

    // Set the size as the number of children
    currentNode.size = children.length;

    // Return the current node along with its children
    return [currentNode, ...children];
  }

  // If no children, size remains 0
  currentNode.size = 0;
  return [currentNode]; // Return the current node only
}

// Fetch the XML, parse it, and transform it
export async function fetchAndParseImageNet(): Promise<TLinearData[]> {
  try {
    const url =
      "https://raw.githubusercontent.com/tzutalin/ImageNet_Utils/master/detection_eval_tools/structure_released.xml";
    const response = await axios.get(url);
    const xmlData = await parseStringPromise(response.data);
    const root = xmlData.ImageNetStructure.synset;

    const linearData: TLinearData[] = [];

    root.forEach((element: any) => {
      linearData.push(...parseElement(element)); // Parse each root element
    });

    return linearData;
  } catch (error) {
    console.error("Error fetching or parsing XML data:", error);
    throw error;
  }
}

export const initDataFetch = async (): Promise<void> => {
  try {
    const linearData = await fetchAndParseImageNet();
    await LinearData.insertMany(linearData);
    console.log("Data saved to MongoDB");
  } catch (error) {
    console.error("Error fetching or processing data:", error);
  }
};
