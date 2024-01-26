import type { MetaFunction } from "@remix-run/node";
import { ChangeEvent, useEffect, useState } from "react";
import { colors } from "util/data/forza-colors";
import { CarColor } from "~/types/color";
import ColorInfo from "~/components/ColorInfo";
import { ColorPreview } from "~/components/ColorPreview";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export default function Index() {
  // List of manufacturers to display
  const manufacturers = [...new Set(colors.map(c => c.MAKE))];

  // Keeps track of the selected manufacturer
  const [selectedManufacturer, setSelectedManufacturer] = useState("");

  // List of available colors to display
  const [colorOptions, setColorOptions] = useState<CarColor[]>([]);

  // Keeps track of the selected color
  const [selectedColor, setSelectedColor] = useState<CarColor>();

  // Update the color options when a manufacturer is selected
  useEffect(() => {
    const nextColorOptions: CarColor[] = colors.filter(color => color.MAKE === selectedManufacturer);

    setColorOptions(nextColorOptions);
  }, [selectedManufacturer])

  // Update UI when a color is selected
  const handleColorSelection = (e: any) => {
    const nextSelectedColor = colors.find(color => color.MAKE === selectedManufacturer && color["COLOUR NAME"] === e.target.value);
    setSelectedColor(nextSelectedColor);
  };

  return (
    <div className="flex flex-col bg-red-300">
      <header>
        <h1 className="text-xl font-bold">Forza Color Selector</h1>
      </header>
      <div>
        <section>
          <label>
            Manufacturer
            <select defaultValue="" onChange={(e) => setSelectedManufacturer(e.target.value)}>
              <option value="" disabled>Select a manufacturer</option>
              {manufacturers.map((manufacturer) => (
                <option key={manufacturer}>{manufacturer}</option>
              ))}
            </select>
          </label>
          <label>
            Color
            <select onChange={handleColorSelection}>
              <option value="" disabled>Select a color</option>
              {colorOptions.map((color) => (
                <option key={color["COLOUR NAME"] + color.COMMENTS}>{color["COLOUR NAME"]}</option>
              ))}
            </select>
          </label>
        </section>
        <section>
          <ColorInfo selectedColor={selectedColor} />
        </section>
        <aside>
          <ColorPreview selectedColor={selectedColor} />
        </aside>
      </div>
    </div>
  );
}
