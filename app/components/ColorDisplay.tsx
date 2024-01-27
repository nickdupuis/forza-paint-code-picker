import { useEffect, useState } from "react";
import { hsbToRgb } from "~/helpers/hsbToRgb";

export interface ColorDisplayProps {
    hue: number;
    saturation: number;
    brightness: number;
};

const ColorDisplay = (props: ColorDisplayProps) => {

    const getBackgroundForSliderMode = (mode: string) => {
        // Rough estimate of the color based on hue
        let [r, g, b] = hsbToRgb(props.hue, 1, 0.5);
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
                ["hue", "brightness", "saturation"].map(attr => (
                    <div key={attr} className="bg-white p-2">
                        <div className="flex justify-between items-center">
                            <span className="uppercase font-bold text-sm">{attr}</span>
                            <span className="font-bold text-sm">{props[attr]}</span>
                        </div>
                        <input
                            className="color-slider appearance-none"
                            style={getBackgroundForSliderMode(attr)}
                            type="range"
                            min="0"
                            max="100"
                            value={`${props[attr] * 100}`}
                            onChange={() => { }}
                        />
                    </div>
                ))
            }
        </>


    );
};

export default ColorDisplay;
