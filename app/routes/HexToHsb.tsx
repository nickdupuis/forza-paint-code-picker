import type { MetaFunction } from "@remix-run/node";
import { useState } from "react";
import ColorDisplay from "~/components/ColorDisplay";
import ColorPreview from "~/components/ColorPreview";
import { hexToHsb } from "~/helpers/hexToHSB";
import { CarColor } from "~/types/CarColor";

export const meta: MetaFunction = () => {
    return [
        { title: "Hex to HSB Converter for Forza Horizon | Paint Code Tool" },
        { name: "description", content: "Convert any hex color code to Forza Horizon HSB slider values. Paste a hex code and get the exact hue, saturation, and brightness values for the in-game paint editor." },
    ];
};

export default function HexToHsb() {
    const [hex, setHex] = useState("");
    const [color, setColor] = useState<CarColor>()

    const handleHexChange = (e) => {
        const nextValue = e.target.value;
        const convertedHex = hexToHsb(nextValue);
        const color: CarColor = {
            "id": "",
            "MAKE": "",
            "COLOUR_NAME": "",
            "PAINT_TYPE": "",
            "COLOR_1_HUE": convertedHex[0].toFixed(2),
            "COLOR_1_SATURATION": convertedHex[1].toFixed(2),
            "COLOR_1_BRIGHTNESS": convertedHex[2].toFixed(2),
            "COLOR_2_BRIGHTNESS": "",
            "COLOR_2_SATURATION": "",
            "COLOR_2_HUE": "",
            "COMMENTS": ""
        };

        setHex(nextValue);
        setColor(color);
    };

    return (
        <div className="flex flex-col lg:flex-row gap-8">
            <div className="lg:w-72 flex-shrink-0">
                <label className="flex flex-col gap-1.5">
                    <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">Input Hex Code</span>
                    <input
                        value={hex}
                        onChange={handleHexChange}
                        placeholder="#FF5500"
                        className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-fuchsia-400 focus:border-transparent font-mono"
                    />
                </label>
                {color && (
                    <div className="mt-6">
                        <ColorDisplay colorNumber={1} selectedColor={color} />
                    </div>
                )}
            </div>
            <aside className="flex-1">
                <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6">
                    <ColorPreview selectedColor={color} />
                </div>
            </aside>
        </div>
    );
}