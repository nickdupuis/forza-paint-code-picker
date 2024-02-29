import { CarColor } from "~/types/CarColor";
import ColorDisplay from "./ColorDisplay";

export interface ColorInfoProps {
    selectedColor?: CarColor;
};

const ColorInfo = ({ selectedColor }: ColorInfoProps) => (
    <div>
        {selectedColor && (
            <>
                <dl className={selectedColor["COLOR_2_BRIGHTNESS"] ? "text-center" : ""}>
                    <dt className="font-bold">Paint Type</dt>
                    <dd>{selectedColor?.["PAINT_TYPE"]}</dd>
                </dl>
                <div className="flex gap-16 mt-4">
                    <div className="flex flex-col">
                        {selectedColor["COLOR_1_BRIGHTNESS"] && (
                            <h3 className="text-lg font-bold">Color 1</h3>
                        )}
                        <div>
                            <ColorDisplay
                                colorNumber={1}
                                selectedColor={selectedColor}
                            />
                        </div>
                    </div>
                    <div className="flex flex-col">
                        {selectedColor?.["COLOR_2_BRIGHTNESS"] && (
                            <>
                                <h3 className="text-lg font-bold">Color 2</h3>
                                <div>
                                    <ColorDisplay
                                        colorNumber={2}
                                        selectedColor={selectedColor}
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

export default ColorInfo;
