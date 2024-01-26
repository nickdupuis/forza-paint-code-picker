import { hsbToRgb } from "~/helpers/hsbToRgb";
import { CarColor } from "~/types/color";

export interface ColorPreviewProps {
    selectedColor?: CarColor;
}

export const ColorPreview = ({ selectedColor }: ColorPreviewProps) => {

    const getRgbColor = () => {
        if (selectedColor) {
            const hueDecimal: number = parseFloat(selectedColor?.["COLOR 1 HUE"]);
            const saturationDecimal: number = parseFloat(selectedColor?.["COLOR 1 SATURATION"]);
            const brightnessDecimal: number = parseFloat(selectedColor?.["COLOR 2 BRIGHTNESS"]);

            const rgb = hsbToRgb(hueDecimal, saturationDecimal, brightnessDecimal);

            return `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;

        } else {
            return "";
        }
    };

    return (
        <>
            <div>Preview</div>
            <div
                style={{ backgroundColor: getRgbColor() }}
                className="w-12 h-12 border border-gray-900"
            />
        </>
    );
};
