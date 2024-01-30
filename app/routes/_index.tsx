import type { MetaFunction } from "@remix-run/node";
import { useState } from "react";
import { CarColor } from "~/types/CarColor";

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
    </div>
  );
}
