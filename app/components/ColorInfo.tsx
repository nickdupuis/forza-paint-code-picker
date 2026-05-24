import { CarColor } from "~/types/CarColor";
import ColorDisplay from "./ColorDisplay";

export interface ColorInfoProps {
    selectedColor?: CarColor;
};

const ColorInfo = ({ selectedColor }: ColorInfoProps) => (
    <div>
        {selectedColor && (
            <>
                <dl className={`${selectedColor["COLOR_2_BRIGHTNESS"] ? "text-center" : ""}`}>
                    <dt className="text-xs font-semibold uppercase tracking-wider text-gray-400">Paint Type</dt>
                    <dd className="text-sm text-gray-700 mt-0.5">{selectedColor?.["PAINT_TYPE"]}</dd>
                </dl>
                <div className="flex gap-8 mt-6">
                    <div className="flex flex-col gap-2">
                        {selectedColor["COLOR_1_BRIGHTNESS"] && (
                            <h3 className="text-sm font-bold text-fuchsia-600 uppercase tracking-wide">Color 1</h3>
                        )}
                        <div>
                            <ColorDisplay
                                colorNumber={1}
                                selectedColor={selectedColor}
                            />
                        </div>
                    </div>
                    <div className="flex flex-col gap-2">
                        {selectedColor?.["COLOR_2_BRIGHTNESS"] && (
                            <>
                                <h3 className="text-sm font-bold text-fuchsia-600 uppercase tracking-wide">Color 2</h3>
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
