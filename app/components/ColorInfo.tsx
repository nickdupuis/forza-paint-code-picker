import { CarColor } from "~/types/CarColor";
import ColorDisplay from "./ColorDisplay";

export interface ColorInfoProps {
    selectedColor?: CarColor;
};

const ColorInfo = ({ selectedColor }: ColorInfoProps) => (
    <div>
        {selectedColor && (
            <>
                <dl className={selectedColor["COLOR 2 BRIGHTNESS"] ? "text-center" : ""}>
                    <dt className="font-bold">Paint Type</dt>
                    <dd>{selectedColor?.["PAINT TYPE"]}</dd>
                </dl>
                <div className="flex gap-16 mt-4">
                    <div className="flex flex-col">
                        {selectedColor["COLOR 1 BRIGHTNESS"] && (
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
                        {selectedColor?.["COLOR 2 BRIGHTNESS"] && (
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
