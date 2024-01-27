import { CarColor } from "~/types/color";
import ColorDisplay from "./ColorDisplay";
import { useEffect, useState } from "react";

export interface ColorInfoProps {
    selectedColor?: CarColor;
};

const ColorInfo = ({ selectedColor }: ColorInfoProps) => {
    const [color1, setColor1] = useState({ hue: 0, saturation: 0, brightness: 0 });
    const [color2, setColor2] = useState({ hue: 0, saturation: 0, brightness: 0 });


    useEffect(() => {
        if (selectedColor) {
            setColor1({
                hue: parseFloat(selectedColor?.["COLOR 1 HUE"]).toFixed(2),
                saturation: parseFloat(selectedColor?.["COLOR 1 SATURATION"]).toFixed(2),
                brightness: parseFloat(selectedColor?.["COLOR 1 BRIGHTNESS"]).toFixed(2),
            });

            if (selectedColor?.["COLOR 2 HUE"]) {
                setColor2({
                    hue: parseFloat(selectedColor?.["COLOR 2 HUE"]).toFixed(2),
                    saturation: parseFloat(selectedColor?.["COLOR 2 SATURATION"]).toFixed(2),
                    brightness: parseFloat(selectedColor?.["COLOR 2 BRIGHTNESS"]).toFixed(2),
                });
            }
        }
    }, [selectedColor]);

    return (
        <div>
            {selectedColor && (
                <>
                    <dl className={selectedColor["COLOR 2 BRIGHTNESS"] ? "text-center" : ""}>
                        <dt className="font-bold">Paint Type</dt>
                        <dd>{selectedColor?.["PAINT TYPE"]}</dd>
                    </dl>
                    <div className="flex gap-16">
                        <div className="flex flex-col">
                            {selectedColor["COLOR 1 BRIGHTNESS"] && (
                                <h3 className="text-lg font-bold">Color 1</h3>
                            )}
                            <div>
                                <ColorDisplay
                                    hue={color1.hue}
                                    saturation={color1.saturation}
                                    brightness={color1.brightness}
                                />
                            </div>
                        </div>
                        <div className="flex flex-col">
                            {selectedColor?.["COLOR 2 BRIGHTNESS"] && (
                                <>
                                    <h3 className="text-lg font-bold">Color 2</h3>
                                    <div>
                                        <ColorDisplay
                                            hue={color2.hue}
                                            saturation={color2.saturation}
                                            brightness={color2.brightness}
                                        />
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default ColorInfo;
