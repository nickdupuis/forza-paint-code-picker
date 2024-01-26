import { useEffect, useState } from "react";
import { hsbToRgb } from "~/helpers/hsbToRgb";
import { CarColor } from "~/types/color";

export interface ColorPreviewProps {
    selectedColor?: CarColor;
}

const ColorPreview = ({ selectedColor }: ColorPreviewProps) => {

    const [previewColor1, setPreviewColor1] = useState({});
    const [previewColor2, setPreviewColor2] = useState({});

    useEffect(() => {
        if (selectedColor) {
            // color 1 decimal values
            let hue1Decimal: number, saturation1Decimal: number, brightness1Decimal: number;

            // color 2 decimal values
            let hue2Decimal: number, saturation2Decimal: number, brightness2Decimal: number;

            // color 1 and 2 RGB arrays
            let color1RGB: number[], color2RGB: number[];

            // Parse out the "L"s and "R"s
            hue1Decimal = parseFloat(selectedColor?.["COLOR 1 HUE"]);
            saturation1Decimal = parseFloat(selectedColor?.["COLOR 1 SATURATION"]);
            brightness1Decimal = parseFloat(selectedColor?.["COLOR 1 BRIGHTNESS"]);

            hue2Decimal = parseFloat(selectedColor?.["COLOR 2 HUE"]);
            saturation2Decimal = parseFloat(selectedColor?.["COLOR 2 SATURATION"]);
            brightness2Decimal = parseFloat(selectedColor?.["COLOR 2 BRIGHTNESS"]);

            // Get the RGB values for color 1
            color1RGB = hsbToRgb(hue1Decimal, saturation1Decimal, brightness1Decimal);
            color2RGB = hsbToRgb(hue2Decimal, saturation2Decimal, brightness2Decimal);

            // Set the preview color classes
            setPreviewColor1({ backgroundColor: `rgb(${color1RGB[0]}, ${color1RGB[1]}, ${color1RGB[2]})` })
            setPreviewColor2({ backgroundColor: `rgb(${color2RGB[0]}, ${color2RGB[1]}, ${color2RGB[2]})` })
        }
    }, [selectedColor]);

    return (
        <>
            <div>Preview</div>
            <div
                style={previewColor1}
                className="w-12 h-12 border border-gray-900"
            />
            {selectedColor?.["COLOR 2 BRIGHTNESS"] && (
                <div
                    style={previewColor2}
                    className="w-12 h-12 border border-gray-900"
                />
            )}

        </>
    );
};

export default ColorPreview
