import type { MetaFunction } from "@remix-run/node";
import { useEffect, useMemo, useState } from "react";
import { useLoaderData } from "@remix-run/react";
import ColorInfo from "~/components/ColorInfo";
import ColorPreview from "~/components/ColorPreview";
import { hsbToRgb } from "~/helpers/hsbToRgb";
import { CarColor } from "~/types/CarColor";

interface HueBand {
    value: string;
    label: string;
    ranges: Array<{ min: number; max: number }>;
}

const HUE_BANDS: HueBand[] = [
    { value: "red", label: "Red", ranges: [{ min: 0, max: 0.04 }, { min: 0.96, max: 1 }] },
    { value: "orange", label: "Orange", ranges: [{ min: 0.04, max: 0.10 }] },
    { value: "yellow", label: "Yellow", ranges: [{ min: 0.10, max: 0.18 }] },
    { value: "green", label: "Green", ranges: [{ min: 0.18, max: 0.42 }] },
    { value: "cyan", label: "Cyan", ranges: [{ min: 0.42, max: 0.54 }] },
    { value: "blue", label: "Blue", ranges: [{ min: 0.54, max: 0.72 }] },
    { value: "purple", label: "Purple", ranges: [{ min: 0.72, max: 0.86 }] },
    { value: "pink", label: "Pink", ranges: [{ min: 0.86, max: 0.96 }] },
];

function parseHue(value: string): number | null {
    const parsed = Number.parseFloat(value);
    return Number.isFinite(parsed) ? parsed : null;
}

function matchesHueBand(color: CarColor, bandValue: string): boolean {
    if (bandValue === "any") {
        return true;
    }

    const hueBand = HUE_BANDS.find((band) => band.value === bandValue);
    if (!hueBand) {
        return false;
    }

    const hue = parseHue(color.COLOR_1_HUE);
    if (hue === null) {
        return false;
    }

    return hueBand.ranges.some((range) => hue >= range.min && hue < range.max);
}

function matchesFinish(color: CarColor, finishValue: string): boolean {
    if (finishValue === "any") {
        return true;
    }

    return color.PAINT_TYPE.trim().toLowerCase() === finishValue.trim().toLowerCase();
}

function getSwatchStyle(color: CarColor): { backgroundColor: string } {
    const hue = parseHue(color.COLOR_1_HUE) ?? 0;
    const sat = parseHue(color.COLOR_1_SATURATION) ?? 0;
    const bri = parseHue(color.COLOR_1_BRIGHTNESS) ?? 0;
    const [r, g, b] = hsbToRgb(hue, sat, bri);

    return { backgroundColor: `rgb(${r}, ${g}, ${b})` };
}

export const meta: MetaFunction = () => {
    return [
        { title: "Forza Hue Finder | Explore Colors by Hue + Finish" },
        {
            name: "description",
            content:
                "Pick a hue like red, orange, or blue and combine it with paint finishes such as metallic or matte to discover matching Forza paint codes.",
        },
    ];
};

export default function HueSuggestions() {
    const colors = useLoaderData<CarColor[]>();

    const finishOptions = useMemo(() => {
        const uniquePaintTypes = [...new Set(
            colors
                .map((color) => color.PAINT_TYPE.trim())
                .filter((paintType) => paintType.length > 0 && paintType.toLowerCase() !== "n/a"),
        )].sort((a, b) =>
            a.localeCompare(b),
        );

        return [{ value: "any", label: "Any finish" }, ...uniquePaintTypes.map((paintType) => ({ value: paintType, label: paintType }))];
    }, [colors]);

    const [selectedHue, setSelectedHue] = useState<string>("red");
    const [selectedFinish, setSelectedFinish] = useState<string>("any");
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [selectedColorId, setSelectedColorId] = useState<string>("");

    const filteredColors = useMemo(() => {
        const search = searchTerm.trim().toLowerCase();

        return colors.filter((color) => {
            const hueMatch = matchesHueBand(color, selectedHue);
            const finishMatch = matchesFinish(color, selectedFinish);
            const searchMatch =
                search.length === 0 ||
                color.COLOUR_NAME.toLowerCase().includes(search) ||
                color.MAKE.toLowerCase().includes(search) ||
                color.PAINT_TYPE.toLowerCase().includes(search);

            return hueMatch && finishMatch && searchMatch;
        });
    }, [colors, selectedHue, selectedFinish, searchTerm]);

    useEffect(() => {
        if (!filteredColors.length) {
            setSelectedColorId("");
            return;
        }

        const selectionStillVisible = filteredColors.some((color) => color.id === selectedColorId);
        if (!selectionStillVisible) {
            setSelectedColorId(filteredColors[0].id);
        }
    }, [filteredColors, selectedColorId]);

    const selectedColor = useMemo(
        () => filteredColors.find((color) => color.id === selectedColorId) ?? null,
        [filteredColors, selectedColorId],
    );

    return (
        <div className="space-y-6">
            <section className="bg-gray-50 border border-gray-200 rounded-2xl p-5 md:p-6">
                <h1 className="text-xl font-bold text-gray-900">Suggest Colors by Hue</h1>
                <p className="text-sm text-gray-600 mt-1">
                    Pick a hue and optionally stack a finish filter (for example, orange + metal flake) to explore matching colors across all manufacturers.
                </p>

                <div className="grid gap-4 mt-5 md:grid-cols-3">
                    <label className="flex flex-col gap-1.5">
                        <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">Hue</span>
                        <select
                            value={selectedHue}
                            onChange={(event) => setSelectedHue(event.target.value)}
                            className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-fuchsia-400"
                        >
                            <option value="any">Any hue</option>
                            {HUE_BANDS.map((band) => (
                                <option value={band.value} key={band.value}>
                                    {band.label}
                                </option>
                            ))}
                        </select>
                    </label>

                    <label className="flex flex-col gap-1.5">
                        <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">Finish</span>
                        <select
                            value={selectedFinish}
                            onChange={(event) => setSelectedFinish(event.target.value)}
                            className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-fuchsia-400"
                        >
                            {finishOptions.map((option) => (
                                <option value={option.value} key={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </label>

                    <label className="flex flex-col gap-1.5">
                        <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">Search (Optional)</span>
                        <input
                            value={searchTerm}
                            onChange={(event) => setSearchTerm(event.target.value)}
                            placeholder="Manufacturer, color name, or paint type"
                            className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-fuchsia-400"
                        />
                    </label>
                </div>
            </section>

            <section className="grid gap-6 lg:grid-cols-[1.1fr,1fr]">
                <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4 md:p-5">
                    <div className="flex items-center justify-between gap-3 mb-3">
                        <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-500">Matches</h2>
                        <span className="text-xs text-gray-500">{filteredColors.length.toLocaleString()} found</span>
                    </div>

                    {filteredColors.length === 0 ? (
                        <p className="text-sm text-gray-500">No colors match these filters yet. Try widening hue or finish.</p>
                    ) : (
                        <ul className="max-h-[30rem] overflow-y-auto space-y-2 pr-1">
                            {filteredColors.map((color) => {
                                const isSelected = selectedColor?.id === color.id;

                                return (
                                    <li key={color.id}>
                                        <button
                                            type="button"
                                            onClick={() => setSelectedColorId(color.id)}
                                            className={`w-full text-left rounded-xl border px-3 py-2.5 transition ${
                                                isSelected
                                                    ? "border-fuchsia-300 bg-fuchsia-50"
                                                    : "border-gray-200 bg-white hover:border-fuchsia-200 hover:bg-fuchsia-50/40"
                                            }`}
                                        >
                                            <div className="flex items-start gap-3">
                                                <div
                                                    style={getSwatchStyle(color)}
                                                    className="w-6 h-6 rounded-md border border-gray-200 shrink-0 mt-0.5"
                                                />
                                                <div className="min-w-0">
                                                    <p className="text-sm font-semibold text-gray-900 truncate">{color.COLOUR_NAME}</p>
                                                    <p className="text-xs text-gray-500 truncate">{color.MAKE}</p>
                                                    <p className="text-xs text-gray-400 truncate">{color.PAINT_TYPE}</p>
                                                </div>
                                            </div>
                                        </button>
                                    </li>
                                );
                            })}
                        </ul>
                    )}
                </div>

                <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6">
                    {selectedColor ? (
                        <>
                            <h2 className="text-lg font-bold text-gray-900 mb-1">{selectedColor.COLOUR_NAME}</h2>
                            <p className="text-sm text-gray-500 mb-6">{selectedColor.MAKE}</p>
                            <div className="flex flex-col xl:flex-row gap-8">
                                <ColorInfo selectedColor={selectedColor} />
                                <ColorPreview selectedColor={selectedColor} />
                            </div>
                        </>
                    ) : (
                        <p className="text-sm text-gray-500">Choose a color from the list to see full HSB details and preview.</p>
                    )}
                </div>
            </section>
        </div>
    );
}

export const clientLoader = async () => {
    const res = await fetch(`${import.meta.env.BASE_URL}colors.json`);
    return res.json();
};

clientLoader.hydrate = true;
