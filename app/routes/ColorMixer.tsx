import type { MetaFunction } from "@remix-run/node";
import { useEffect, useMemo, useState } from "react";
import { useLoaderData } from "@remix-run/react";
import ColorInfo from "~/components/ColorInfo";
import ColorPreview from "~/components/ColorPreview";
import { hsbToRgb } from "~/helpers/hsbToRgb";
import { rgbToHex } from "~/helpers/rgbToHex";
import { findClosestMatches } from "~/helpers/colorMatching";
import { CarColor } from "~/types/CarColor";

const MATCH_LIMIT = 8;

const SLIDER_MODES = ["hue", "saturation", "brightness"] as const;
type SliderMode = (typeof SLIDER_MODES)[number];

const SLIDER_LABELS: Record<SliderMode, string> = {
    hue: "Hue",
    saturation: "Saturation",
    brightness: "Brightness",
};

export const meta: MetaFunction = () => {
    return [
        { title: "Forza Color Mixer | Build a Color with HSB Sliders" },
        {
            name: "description",
            content:
                "Drag the hue, saturation, and brightness sliders to mix any Forza Horizon paint color. Get the matching hex code and the closest paint-code matches instantly.",
        },
    ];
};

export default function ColorMixer() {
    const colors = useLoaderData<CarColor[]>();
    const [hsb, setHsb] = useState({ hue: 0, saturation: 0.5, brightness: 0.5 });
    const [selectedMatchId, setSelectedMatchId] = useState<string>("");
    const [copyStatus, setCopyStatus] = useState<"idle" | "copied" | "error">("idle");

    const [r, g, b] = useMemo(
        () => hsbToRgb(hsb.hue, hsb.saturation, hsb.brightness),
        [hsb.hue, hsb.saturation, hsb.brightness],
    );

    const hex = useMemo(() => rgbToHex(r, g, b), [r, g, b]);

    const mixedColor = useMemo(
        () =>
            ({
                id: "",
                MAKE: "",
                COLOUR_NAME: "",
                PAINT_TYPE: "",
                COLOR_1_HUE: hsb.hue.toFixed(2),
                COLOR_1_SATURATION: hsb.saturation.toFixed(2),
                COLOR_1_BRIGHTNESS: hsb.brightness.toFixed(2),
                COLOR_2_BRIGHTNESS: "",
                COLOR_2_SATURATION: "",
                COLOR_2_HUE: "",
                COMMENTS: "",
            }) as CarColor,
        [hsb.hue, hsb.saturation, hsb.brightness],
    );

    const bestMatches = useMemo(
        () => findClosestMatches(colors, [hsb.hue, hsb.saturation, hsb.brightness], MATCH_LIMIT),
        [colors, hsb.hue, hsb.saturation, hsb.brightness],
    );

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

    const getSliderBackground = (mode: SliderMode): string => {
        switch (mode) {
            case "hue":
                return "linear-gradient(to right, red, orange, yellow, green, cyan, blue, indigo, red)";
            case "saturation":
                return `linear-gradient(to right, white, rgb(${r}, ${g}, ${b}))`;
            case "brightness":
                return `linear-gradient(to right, black, rgb(${r}, ${g}, ${b}))`;
        }
    };

    const handleSliderChange = (mode: SliderMode) => (event: React.ChangeEvent<HTMLInputElement>) => {
        const next = Number.parseFloat(event.target.value) / 100;
        setHsb((current) => ({ ...current, [mode]: next }));
    };

    const handleCopyHex = async () => {
        try {
            await navigator.clipboard.writeText(hex);
            setCopyStatus("copied");
        } catch {
            setCopyStatus("error");
        }
    };

    useEffect(() => {
        if (copyStatus === "idle") {
            return;
        }

        const timeout = window.setTimeout(() => setCopyStatus("idle"), 1800);
        return () => window.clearTimeout(timeout);
    }, [copyStatus]);

    return (
        <div className="flex flex-col lg:flex-row gap-8">
            <div className="lg:w-80 flex-shrink-0 space-y-6">
                <div>
                    <h1 className="text-xl font-bold text-gray-900">Color Mixer</h1>
                    <p className="text-sm text-gray-600 mt-1">
                        Drag the sliders to build a color and get its hex code plus the closest paint-code matches.
                    </p>
                </div>

                <div className="space-y-3">
                    {SLIDER_MODES.map((mode) => (
                        <div key={mode} className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                            <div className="flex justify-between items-center mb-1.5">
                                <span className="uppercase font-semibold text-xs tracking-wider text-gray-400">
                                    {SLIDER_LABELS[mode]}
                                </span>
                                <span className="font-mono text-xs text-fuchsia-600">{hsb[mode].toFixed(2)}</span>
                            </div>
                            <input
                                className="color-slider appearance-none w-full h-3 rounded-full border border-gray-300"
                                style={{ backgroundImage: getSliderBackground(mode) }}
                                type="range"
                                min="0"
                                max="100"
                                value={`${hsb[mode] * 100}`}
                                onChange={handleSliderChange(mode)}
                            />
                        </div>
                    ))}
                </div>

                <label className="flex flex-col gap-1.5">
                    <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">Hex Code</span>
                    <div className="flex items-center gap-2">
                        <input
                            value={hex}
                            readOnly
                            className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 font-mono focus:outline-none"
                        />
                        <button
                            type="button"
                            onClick={handleCopyHex}
                            className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-semibold uppercase tracking-wide text-gray-700 hover:border-fuchsia-300 hover:bg-fuchsia-50"
                        >
                            Copy
                        </button>
                    </div>
                    {copyStatus === "copied" && <span className="text-xs text-emerald-700">Hex copied.</span>}
                    {copyStatus === "error" && (
                        <span className="text-xs text-amber-700">Could not copy automatically.</span>
                    )}
                </label>

                <div>
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
                        Closest Paint-Code Matches
                    </h3>
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
                </div>
            </div>

            <aside className="flex-1">
                <div className="space-y-6">
                    <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6">
                        <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-500 mb-4">Mixed Color</h2>
                        <ColorPreview selectedColor={mixedColor} />
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
