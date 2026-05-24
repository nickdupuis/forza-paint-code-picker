import fs from "fs";
import path from "path";
import { CarColor } from "~/types/CarColor";

let cachedColors: CarColor[] | null = null;

export function loadColors(): CarColor[] {
  if (cachedColors) return cachedColors;

  const csvPath = path.resolve("colorsheet.csv");
  const content = fs.readFileSync(csvPath, "utf-8");
  const lines = content.split("\n").filter((line) => line.trim() !== "");

  // Skip the first two header rows
  const dataLines = lines.slice(2);

  cachedColors = dataLines.map((line, index) => {
    const cols = parseCSVLine(line);
    return {
      id: String(index + 1),
      MAKE: cols[0] || "",
      COLOUR_NAME: cols[1] || "",
      PAINT_TYPE: cols[2] || "",
      COLOR_1_HUE: cols[3] || "",
      COLOR_1_SATURATION: cols[4] || "",
      COLOR_1_BRIGHTNESS: cols[5] || "",
      COLOR_2_HUE: cols[6] || "",
      COLOR_2_SATURATION: cols[7] || "",
      COLOR_2_BRIGHTNESS: cols[8] || "",
      COMMENTS: cols[9] || "",
    };
  });

  return cachedColors;
}

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === "," && !inQuotes) {
      result.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
}
