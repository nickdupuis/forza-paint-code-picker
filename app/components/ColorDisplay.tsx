import { useEffect, useState } from "react";
import { hsbToRgb } from "~/helpers/hsbToRgb";
import { CarColor } from "~/types/CarColor";
import { HSBColor } from "~/types/HSBColor";

export interface ColorDisplayProps {
    colorNumber: 1 | 2;
    selectedColor: CarColor;
};

type SliderMode = "hue" | "saturation" | "brightness";

const ColorDisplay = ({ colorNumber, selectedColor }: ColorDisplayProps) => {

    // HSB values for the currently selected color
    const [color, setColor] = useState<HSBColor>({ hue: "", saturation: "", brightness: "" });

    // Update the selected color when it changes
    useEffect(() => {
        if (selectedColor) {
            setColor({
                hue: selectedColor?.[`COLOR_${colorNumber}_HUE`],
                saturation: selectedColor?.[`COLOR_${colorNumber}_SATURATION`],
                brightness: selectedColor?.[`COLOR_${colorNumber}_BRIGHTNESS`],
            });
        }
    }, [selectedColor]);

    const getBackgroundForSliderMode = (mode: SliderMode) => {
        // Get a rough estimate of the color based on hue
        const hue = parseFloat(color.hue);
        let [r, g, b] = hsbToRgb(hue, 1, 0.5);

        switch (mode) {
            case "hue":
                return {
                    backgroundImage: "linear-gradient(to right, red, orange, yellow, green, cyan, blue, indigo, red)"
                };
            case "saturation":
                // fades from white to color
                return {
                    backgroundImage: `linear-gradient(to right, white, rgb(${r}, ${g}, ${b})`
                }
            case "brightness":
                // fades from black to color
                return {
                    backgroundImage: `linear-gradient(to right, black, rgb(${r}, ${g}, ${b})`
                };
        }

    };

    return (
        <>
            {
                ["hue", "brightness", "saturation"].map((attr) => (
                    <div key={attr} className="bg-white p-2">
                        <div className="flex justify-between items-center gap-2">
                            <span className="uppercase font-bold text-sm">{attr}</span>
                            <span className="font-bold text-sm">{color[attr as SliderMode]}</span>
                        </div>
                        <input
                            className="color-slider appearance-none w-full border border-black"
                            style={getBackgroundForSliderMode(attr as SliderMode)}
                            type="range"
                            min="0"
                            max="100"
                            value={`${parseFloat(color[attr as SliderMode]) * 100}`}
                            onChange={() => { }}
                        />
                    </div>
                ))
            }
        </>


    );
};

export default ColorDisplay;
