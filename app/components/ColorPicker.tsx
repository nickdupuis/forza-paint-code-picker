import { useEffect, useState } from "react";
import { colors } from "util/data/forza-colors";
import { CarColor } from "~/types/color";

export interface ColorPickerProps {
    handleColorChange: Function,
};

const ColorPicker = ({ handleColorChange }: ColorPickerProps) => {
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

        // Update the selected color to the first in the list when the options change
        if (nextColorOptions.length && nextColorOptions[0]["COLOUR NAME"]) {
            setSelectedColorName(nextColorOptions[0]["COLOUR NAME"]);
        }
    }, [selectedManufacturer])

    // Notify parent component of selected color change
    useEffect(() => {
        if (handleColorChange) {
            const color: CarColor = colors.find(color => color.MAKE === selectedManufacturer && color["COLOUR NAME"] === selectedColorName)!;
            handleColorChange(color);
        }
    }, [selectedColorName]);

    return (
        <>
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
                <select onChange={(e) => setSelectedColorName(e.target.value)}>
                    <option value="" disabled>Select a color</option>
                    {colorNameOptions.map((color, idx) => (
                        <option key={color["COLOUR NAME"] + idx}>{color["COLOUR NAME"]}</option>
                    ))}
                </select>
            </label>
        </>
    );
};

export default ColorPicker