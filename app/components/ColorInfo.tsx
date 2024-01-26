import { CarColor } from "~/types/color";

export interface ColorInfoProps {
    selectedColor?: CarColor;
};

export const ColorInfo = ({ selectedColor }: ColorInfoProps) => (
    // Use a description list to display a list of key/value pairs
    <div>
        Color Info:
        {selectedColor && (
            <>
                <dl>
                    <dt>Paint Type</dt>
                    <dd>{selectedColor?.["PAINT TYPE"]}</dd>
                </dl>
                <h3>Color 1</h3>
                <dl>
                    <dt>Hue</dt>
                    <dd>{selectedColor?.["COLOR 1 HUE"]}</dd>
                    <dt>Saturation</dt>
                    <dd>{selectedColor?.["COLOR 1 SATURATION"]}</dd>
                    <dt>Brightness</dt>
                    <dd>{selectedColor?.["COLOR 1 BRIGHTNESS"]}</dd>
                </dl>
                {selectedColor?.["COLOR 2 BRIGHTNESS"] && (
                    <dl>
                        <dd>{selectedColor?.["COLOR 2 HUE"]}</dd>
                        <dt>Saturation</dt>
                        <dd>{selectedColor?.["COLOR 2 SATURATION"]}</dd>
                        <dt>Brightness</dt>
                        <dd>{selectedColor?.["COLOR 2 BRIGHTNESS"]}</dd>
                    </dl>
                )}</>
        )}
    </div>
);

export default ColorInfo;
