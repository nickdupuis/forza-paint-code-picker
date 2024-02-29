import { useState } from "react";
import ColorDisplay from "~/components/ColorDisplay";
import ColorPreview from "~/components/ColorPreview";
import { hexToHsb } from "~/helpers/hexToHSB";
import { CarColor } from "~/types/CarColor";

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
        <div className="flex gap-8 bg-gray-300 p-8 h-screen">
            <div>
                <label>
                    <span className="mr-2">Input Hex Code: </span>
                    <input
                        value={hex}
                        onChange={handleHexChange}
                        placeholder=""
                    />
                    {color && (
                        <div className="mt-4">
                            <ColorDisplay colorNumber={1} selectedColor={color} />
                        </div>
                    )}
                </label>
            </div>
            <aside>
                <ColorPreview selectedColor={color} />
            </aside>
        </div>
    );
}