import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const csvPath = path.resolve(__dirname, "..", "colorsheet.csv");
const outPath = path.resolve(__dirname, "..", "public", "colors.json");

const content = fs.readFileSync(csvPath, "utf-8");
const lines = content.split("\n").filter((line) => line.trim() !== "");

// Skip the two header rows
const dataLines = lines.slice(2);

function parseCSVLine(line) {
  const result = [];
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

const colors = dataLines.map((line, index) => {
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

fs.writeFileSync(outPath, JSON.stringify(colors));
console.log(`Generated ${colors.length} colors -> public/colors.json`);
