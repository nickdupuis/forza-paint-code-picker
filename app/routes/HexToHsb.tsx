import type { MetaFunction } from "@remix-run/node";
import { useEffect, useMemo, useState } from "react";
import { useLoaderData } from "@remix-run/react";
import ColorDisplay from "~/components/ColorDisplay";
import ColorInfo from "~/components/ColorInfo";
import ColorPreview from "~/components/ColorPreview";
import { hexToHsb } from "~/helpers/hexToHSB";
import { CarColor } from "~/types/CarColor";

const HEX_MATCH_LIMIT = 8;

function normalizeHex(value: string): string | null {
    const trimmed = value.trim();
    if (!trimmed) {
        return null;
    }

    const withHash = trimmed.startsWith("#") ? trimmed : `#${trimmed}`;
    return /^#([0-9A-Fa-f]{3}){1,2}$/.test(withHash) ? withHash : null;
}

function parseValue(value: string): number | null {
    const parsed = Number.parseFloat(value);
    return Number.isFinite(parsed) ? parsed : null;
}

function clamp01(value: number): number {
    return Math.min(1, Math.max(0, value));
}

function normalizeHueValue(value: number): number {
    const wrapped = value % 1;
    return wrapped < 0 ? wrapped + 1 : wrapped;
}

function hueDistance(a: number, b: number): number {
    const distance = Math.abs(normalizeHueValue(a) - normalizeHueValue(b));
    return Math.min(distance, 1 - distance);
}

function similarityScore(target: [number, number, number], candidate: [number, number, number]): number {
    const hueDiff = hueDistance(target[0], candidate[0]);
    const satDiff = Math.abs(clamp01(target[1]) - clamp01(candidate[1]));
    const briDiff = Math.abs(clamp01(target[2]) - clamp01(candidate[2]));
    const weightedDistance = hueDiff * 0.55 + satDiff * 0.25 + briDiff * 0.2;

    return Math.min(100, Math.max(0, Math.round((1 - weightedDistance) * 100)));
}

export const meta: MetaFunction = () => {
    return [
        { title: "Hex to HSB Converter for Forza Horizon | Paint Code Tool" },
        { name: "description", content: "Convert any hex color code to Forza Horizon HSB slider values. Paste a hex code and get the exact hue, saturation, and brightness values for the in-game paint editor." },
    ];
};

export default function HexToHsb() {
    const colors = useLoaderData<CarColor[]>();
    const [hex, setHex] = useState("");
    const [selectedMatchId, setSelectedMatchId] = useState<string>("");

    const normalizedHex = useMemo(() => normalizeHex(hex), [hex]);

    const color = useMemo(() => {
        if (!normalizedHex) {
            return undefined;
        }

        const convertedHex = hexToHsb(normalizedHex);

        return {
            id: "",
            MAKE: "",
            COLOUR_NAME: "",
            PAINT_TYPE: "",
            COLOR_1_HUE: convertedHex[0].toFixed(2),
            COLOR_1_SATURATION: convertedHex[1].toFixed(2),
            COLOR_1_BRIGHTNESS: convertedHex[2].toFixed(2),
            COLOR_2_BRIGHTNESS: "",
            COLOR_2_SATURATION: "",
            COLOR_2_HUE: "",
            COMMENTS: "",
        } as CarColor;
    }, [normalizedHex]);

    const bestMatches = useMemo(() => {
        if (!normalizedHex) {
            return [] as Array<{ color: CarColor; score: number }>;
        }

        const target = hexToHsb(normalizedHex);

        return colors
            .map((datasetColor) => {
                const hue = parseValue(datasetColor.COLOR_1_HUE);
                const saturation = parseValue(datasetColor.COLOR_1_SATURATION);
                const brightness = parseValue(datasetColor.COLOR_1_BRIGHTNESS);

                if (hue === null || saturation === null || brightness === null) {
                    return null;
                }

                return {
                    color: datasetColor,
                    score: similarityScore(target, [normalizeHueValue(hue), clamp01(saturation), clamp01(brightness)]),
                };
            })
            .filter((entry): entry is { color: CarColor; score: number } => entry !== null)
            .sort((a, b) => b.score - a.score)
            .slice(0, HEX_MATCH_LIMIT);
    }, [colors, normalizedHex]);

    useEffect(() => {
        if (!bestMatches.length) {
            setSelectedMatchId("");
            return;
        }

        const stillVisible = bestMatches.some((match) => match.color.id === selectedMatchId);
        if (!stillVisible) {
            setSelectedMatchId(bestMatches[0].color.id);
        }
    }, [bestMatches, selectedMatchId]);

    const selectedMatch = useMemo(
        () => bestMatches.find((match) => match.color.id === selectedMatchId)?.color ?? null,
        [bestMatches, selectedMatchId],
    );

    const handleHexChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setHex(e.target.value);
    };

    return (
        <div className="flex flex-col lg:flex-row gap-8">
            <div className="lg:w-72 flex-shrink-0">
                <label className="flex flex-col gap-1.5">
                    <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">Input Hex Code</span>
                    <input
                        value={hex}
                        onChange={handleHexChange}
                        placeholder="#FF5500"
                        className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-fuchsia-400 focus:border-transparent font-mono"
                    />
                </label>
                {!normalizedHex && hex.trim().length > 0 && (
                    <p className="text-xs text-amber-600 mt-2">Enter a valid hex color such as #FF5500.</p>
                )}
                {color && (
                    <div className="mt-6">
                        <ColorDisplay colorNumber={1} selectedColor={color} />
                    </div>
                )}

                <div className="mt-6">
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Closest Paint-Code Matches</h3>
                    {!normalizedHex ? (
                        <p className="text-sm text-gray-500">Enter a valid hex to see matches.</p>
                    ) : (
                        <ul className="space-y-2 max-h-72 overflow-y-auto pr-1">
                            {bestMatches.map((match) => {
                                const isSelected = match.color.id === selectedMatchId;

                                return (
                                    <li key={match.color.id}>
                                        <button
                                            type="button"
                                            onClick={() => setSelectedMatchId(match.color.id)}
                                            className={`w-full text-left rounded-lg border px-3 py-2 transition ${
                                                isSelected
                                                    ? "border-fuchsia-300 bg-fuchsia-50"
                                                    : "border-gray-200 bg-white hover:border-fuchsia-200 hover:bg-fuchsia-50/40"
                                            }`}
                                        >
                                            <p className="text-sm font-semibold text-gray-900 truncate">{match.color.COLOUR_NAME}</p>
                                            <p className="text-xs text-gray-500 truncate">{match.color.MAKE}</p>
                                            <p className="text-xs text-gray-500">Match {match.score}%</p>
                                        </button>
                                    </li>
                                );
                            })}
                        </ul>
                    )}
                </div>
            </div>
            <aside className="flex-1">
                <div className="space-y-6">
                    <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6">
                        <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-500 mb-4">Hex Preview</h2>
                        <ColorPreview selectedColor={color} />
                    </div>

                    <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6">
                        <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-500 mb-3">Best Match Details</h2>
                        {selectedMatch ? (
                            <>
                                <h3 className="text-lg font-bold text-gray-900 mb-1">{selectedMatch.COLOUR_NAME}</h3>
                                <p className="text-sm text-gray-500 mb-6">{selectedMatch.MAKE}</p>
                                <div className="flex flex-col xl:flex-row gap-8">
                                    <ColorInfo selectedColor={selectedMatch} />
                                    <ColorPreview selectedColor={selectedMatch} />
                                </div>
                            </>
                        ) : (
                            <p className="text-sm text-gray-500">Choose a match to see full details and preview.</p>
                        )}
                    </div>
                </div>
            </aside>
        </div>
    );
}

export const clientLoader = async () => {
    const res = await fetch(`${import.meta.env.BASE_URL}colors.json`);
    return res.json();
};

clientLoader.hydrate = true;