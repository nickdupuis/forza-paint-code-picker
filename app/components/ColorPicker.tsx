import { useEffect, useState } from "react";
import { CarColor } from "~/types/CarColor";

export interface ColorPickerProps {
    colors: CarColor[],
    handleColorChange: Function,
};

const ColorPicker = ({ colors, handleColorChange }: ColorPickerProps) => {
    // Keeps track of the selected manufacturer
    const [selectedManufacturer, setSelectedManufacturer] = useState<string>();

    // List of manufacturers to display
    const manufacturers = [...new Set(colors.map(c => c.MAKE))];

    // List of available colors to display
    const [colorNameOptions, setColorNameOptions] = useState<CarColor[]>([]);

    // Keeps track of the selected color
    const [selectedColorName, setSelectedColorName] = useState<string>();

    // Update the color options when a manufacturer is selected
    useEffect(() => {
        const nextColorOptions: CarColor[] = colors.filter(color => color.MAKE === selectedManufacturer);

        setColorNameOptions(nextColorOptions);

        // Update the selected color to the first in the list when the options
        if (nextColorOptions.length && nextColorOptions[0]["COLOUR_NAME"]) {
            setSelectedColorName(nextColorOptions[0]["COLOUR_NAME"]);
        }
    }, [selectedManufacturer])

    // Notify parent component of selected color change
    useEffect(() => {
        if (handleColorChange) {
            const color: CarColor = colors.find(color => color.MAKE === selectedManufacturer && color["COLOUR_NAME"] === selectedColorName)!;
            handleColorChange(color);
        }
    }, [selectedColorName]);

    return (
        <div className="flex flex-col gap-4">
            <label className="flex flex-col gap-1.5">
                <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">Manufacturer</span>
                <select className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-fuchsia-400 focus:border-transparent" defaultValue="" onChange={(e) => setSelectedManufacturer(e.target.value)}>
                    <option value="" disabled>Select a manufacturer</option>
                    {manufacturers.map((manufacturer) => (
                        <option key={manufacturer}>{manufacturer}</option>
                    ))}
                </select>
            </label>
            <label className="flex flex-col gap-1.5">
                <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">Color</span>
                <select className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-fuchsia-400 focus:border-transparent" onChange={(e) => setSelectedColorName(e.target.value)}>
                    <option value="" disabled>Select a color</option>
                    {colorNameOptions.map((color, idx) => (
                        <option key={color["COLOUR_NAME"] + idx}>{color["COLOUR_NAME"]}</option>
                    ))}
                </select>
            </label>
        </div>
    );
};

export default ColorPicker