import type { MetaFunction } from "@remix-run/node";
import { useState } from "react";
import ColorInfo from "~/components/ColorInfo";
import ColorPicker from "~/components/ColorPicker";
import ColorPreview from "~/components/ColorPreview";

import { CarColor } from "~/types/color";

export const meta: MetaFunction = () => {
  return [
    { title: "Forza Color Selector" },
  ];
};

export default function Index() {
  // Stores the color selected from ColorPicker
  const [selectedColor, setSelectedColor] = useState<CarColor>();

  // Handle the change from ColorPicker
  const onColorChange = (color: CarColor) => {
    setSelectedColor(color);
  };

  return (
    <div className="flex flex-col bg-gray-300 p-8 h-screen">
      <header>
        <h1 className="text-xl font-bold">
          Forza Color Selector
        </h1>
      </header>
      <div className="flex items-center justify-between">
        <section>
          <ColorPicker handleColorChange={onColorChange} />
        </section>
        <section>
          <ColorInfo selectedColor={selectedColor} />
        </section>
        <section>
          <ColorPreview selectedColor={selectedColor} />
        </section>
      </div>
    </div>
  );
}
