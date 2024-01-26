import { CarColor } from "~/types/color";

export interface ColorInfoProps {
    selectedColor?: CarColor;
};

const ColorInfo = ({ selectedColor }: ColorInfoProps) => (
    // Use a description list to display a list of key/value pairs
    <div>
        {selectedColor && (
            <>
                <dl className={selectedColor["COLOR 2 BRIGHTNESS"] ? "text-center" : ""}>
                    <dt className="font-bold">Paint Type</dt>
                    <dd>{selectedColor?.["PAINT TYPE"]}</dd>
                </dl>
                <div className="flex gap-16">
                    <div className="flex flex-col">
                        {selectedColor["COLOR 2 BRIGHTNESS"] && (
                            <h3 className="text-lg font-bold">Color 1</h3>
                        )}
                        <dl>
                            <dt className="font-bold">Hue</dt>
                            <dd>{selectedColor?.["COLOR 1 HUE"]}</dd>
                            <dt className="font-bold">Saturation</dt>
                            <dd>{selectedColor?.["COLOR 1 SATURATION"]}</dd>
                            <dt className="font-bold">Brightness</dt>
                            <dd>{selectedColor?.["COLOR 1 BRIGHTNESS"]}</dd>
                        </dl>
                    </div>
                    <div className="flex flex-col">
                        {selectedColor?.["COLOR 2 BRIGHTNESS"] && (
                            <>
                                <h3 className="text-lg font-bold">Color 2</h3>
                                <dl>
                                    <dt className="font-bold"> Hue</dt>
                                    <dd>{selectedColor?.["COLOR 2 HUE"]}</dd>
                                    <dt className="font-bold">Saturation</dt>
                                    <dd>{selectedColor?.["COLOR 2 SATURATION"]}</dd>
                                    <dt className="font-bold">Brightness</dt>
                                    <dd>{selectedColor?.["COLOR 2 BRIGHTNESS"]}</dd>
                                </dl>
                            </>
                        )}
                    </div>
                </div>

            </>
        )}
    </div>
);

export default ColorInfo;
