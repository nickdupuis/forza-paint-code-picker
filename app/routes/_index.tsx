import type { MetaFunction } from "@remix-run/node";
import { useEffect, useState } from "react";
import { colors } from "util/data/forza-colors";
import ColorInfo from "~/components/ColorInfo";
import ColorPicker from "~/components/ColorPicker";
import ColorPreview from "~/components/ColorPreview";

import { CarColor } from "~/types/color";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export default function Index() {
  const [selectedColor, setSelectedColor] = useState<CarColor>();

  const onColorChange = (color: CarColor) => {
    setSelectedColor(color);
  };

  return (
    <div className="flex flex-col bg-gray-300">
      <header>
        <h1 className="text-xl font-bold">Forza Color Selector</h1>
      </header>
      <div>
        <section>
          <ColorPicker handleColorChange={onColorChange} />
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
