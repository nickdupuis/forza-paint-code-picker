import type { MetaFunction } from "@remix-run/node";
import { useEffect, useMemo, useRef, useState } from "react";
import type { DragEvent, MouseEvent } from "react";
import { useLoaderData } from "@remix-run/react";
import ColorInfo from "~/components/ColorInfo";
import ColorPreview from "~/components/ColorPreview";
import { hexToHsb } from "~/helpers/hexToHSB";
import { findClosestPhotoMatches } from "~/helpers/colorMatching";
import type { ChannelColorMatch } from "~/helpers/colorMatching";
import { hsbToRgb } from "~/helpers/hsbToRgb";
import { rgbToHex } from "~/helpers/rgbToHex";
import type { CarColor } from "~/types/CarColor";

const SUPPORTED_IMAGE_TYPES = new Set(["image/png", "image/jpeg", "image/webp"]);
const MAX_FILE_SIZE = 20 * 1024 * 1024;
const MAX_IMAGE_PIXELS = 20_000_000;
const MAGNIFIER_RADIUS = 5;
const PRIMARY_MATCH_LIMIT = 20;
const SECONDARY_MATCH_LIMIT = 8;

type SampleSize = 1 | 9 | 21 | 41;

interface SamplePoint {
    x: number;
    y: number;
}

interface SampledColor {
    hex: string;
    hsb: [number, number, number];
}

interface LoadedImage {
    fileName: string;
    image: HTMLImageElement;
    url: string;
}

function sampleImage(image: HTMLImageElement, point: SamplePoint, sampleSize: SampleSize): [number, number, number] | null {
    const radius = Math.floor(sampleSize / 2);
    const left = Math.max(0, point.x - radius);
    const top = Math.max(0, point.y - radius);
    const right = Math.min(image.naturalWidth, point.x + radius + 1);
    const bottom = Math.min(image.naturalHeight, point.y + radius + 1);
    const width = right - left;
    const height = bottom - top;
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;

    const context = canvas.getContext("2d", { willReadFrequently: true });
    if (!context) {
        return null;
    }

    context.imageSmoothingEnabled = false;
    context.drawImage(image, left, top, width, height, 0, 0, width, height);

    const { data } = context.getImageData(0, 0, width, height);
    let red = 0;
    let green = 0;
    let blue = 0;
    let alphaTotal = 0;

    for (let index = 0; index < data.length; index += 4) {
        const alpha = data[index + 3] / 255;
        red += data[index] * alpha;
        green += data[index + 1] * alpha;
        blue += data[index + 2] * alpha;
        alphaTotal += alpha;
    }

    if (alphaTotal === 0) {
        return null;
    }

    return [Math.round(red / alphaTotal), Math.round(green / alphaTotal), Math.round(blue / alphaTotal)];
}

function getChannelSwatch(match: ChannelColorMatch): string {
    const hue = Number.parseFloat(match.color[`COLOR_${match.channel}_HUE`]);
    const saturation = Number.parseFloat(match.color[`COLOR_${match.channel}_SATURATION`]);
    const brightness = Number.parseFloat(match.color[`COLOR_${match.channel}_BRIGHTNESS`]);
    const [red, green, blue] = hsbToRgb(hue, saturation, brightness);
    return `rgb(${red}, ${green}, ${blue})`;
}

export const meta: MetaFunction = () => [
    { title: "Photo Paint Matcher | Forza Paint Codes" },
    {
        name: "description",
        content: "Sample a color from a photo or screenshot and find the closest Forza paint codes.",
    },
];

export default function PhotoColorMatcher() {
    const colors = useLoaderData<CarColor[]>();
    const [loadedImage, setLoadedImage] = useState<LoadedImage | null>(null);
    const [uploadError, setUploadError] = useState("");
    const [isLoadingImage, setIsLoadingImage] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [sampleSize, setSampleSize] = useState<SampleSize>(21);
    const [samplePoint, setSamplePoint] = useState<SamplePoint | null>(null);
    const [sampledColor, setSampledColor] = useState<SampledColor | null>(null);
    const [sampleError, setSampleError] = useState("");
    const [selectedMatchId, setSelectedMatchId] = useState("");
    const uploadRequestId = useRef(0);
    const magnifierRef = useRef<HTMLCanvasElement>(null);

    const photoMatches = useMemo(
        () => sampledColor
            ? findClosestPhotoMatches(colors, sampledColor.hsb, PRIMARY_MATCH_LIMIT)
            : { primary: [], secondary: [] },
        [colors, sampledColor],
    );
    const visibleMatches = useMemo(
        () => [...photoMatches.primary, ...photoMatches.secondary.slice(0, SECONDARY_MATCH_LIMIT)],
        [photoMatches],
    );

    useEffect(() => {
        if (!visibleMatches.length) {
            setSelectedMatchId("");
            return;
        }

        if (!visibleMatches.some((match) => match.color.id === selectedMatchId)) {
            setSelectedMatchId(photoMatches.primary[0]?.color.id ?? visibleMatches[0].color.id);
        }
    }, [visibleMatches, photoMatches, selectedMatchId]);

    const selectedMatch = useMemo(
        () => visibleMatches.find((match) => match.color.id === selectedMatchId)?.color ?? null,
        [visibleMatches, selectedMatchId],
    );

    const updateSample = (point: SamplePoint, size = sampleSize) => {
        if (!loadedImage) {
            return;
        }

        setSamplePoint(point);
        const rgb = sampleImage(loadedImage.image, point, size);
        if (!rgb) {
            setSampledColor(null);
            setSampleError("That point is fully transparent or could not be sampled. Choose another point.");
            return;
        }

        const hex = rgbToHex(...rgb);
        setSampledColor({ hex, hsb: hexToHsb(hex) });
        setSampleError("");
    };

    const handleImageClick = (event: MouseEvent<HTMLButtonElement>) => {
        if (!loadedImage) {
            return;
        }

        const displayedImage = event.currentTarget.querySelector("img");
        if (!displayedImage) {
            return;
        }

        const bounds = displayedImage.getBoundingClientRect();
        const clientX = event.detail === 0 ? bounds.left + bounds.width / 2 : event.clientX;
        const clientY = event.detail === 0 ? bounds.top + bounds.height / 2 : event.clientY;
        const relativeX = (clientX - bounds.left) / bounds.width;
        const relativeY = (clientY - bounds.top) / bounds.height;
        if (relativeX < 0 || relativeX > 1 || relativeY < 0 || relativeY > 1) {
            return;
        }

        updateSample({
            x: Math.min(loadedImage.image.naturalWidth - 1, Math.floor(relativeX * loadedImage.image.naturalWidth)),
            y: Math.min(loadedImage.image.naturalHeight - 1, Math.floor(relativeY * loadedImage.image.naturalHeight)),
        });
    };

    const handleSampleSizeChange = (size: SampleSize) => {
        setSampleSize(size);
        if (samplePoint) {
            updateSample(samplePoint, size);
        }
    };

    useEffect(() => {
        const canvas = magnifierRef.current;
        if (!canvas || !loadedImage || !samplePoint) {
            return;
        }

        const context = canvas.getContext("2d");
        if (!context) {
            return;
        }

        const radius = Math.max(MAGNIFIER_RADIUS, Math.floor(sampleSize / 2));
        const sourceLeft = samplePoint.x - radius;
        const sourceTop = samplePoint.y - radius;
        const left = Math.max(0, sourceLeft);
        const top = Math.max(0, sourceTop);
        const right = Math.min(loadedImage.image.naturalWidth, samplePoint.x + radius + 1);
        const bottom = Math.min(loadedImage.image.naturalHeight, samplePoint.y + radius + 1);
        const width = right - left;
        const height = bottom - top;
        const scale = canvas.width / (radius * 2 + 1);

        context.clearRect(0, 0, canvas.width, canvas.height);
        context.imageSmoothingEnabled = false;
        context.drawImage(
            loadedImage.image,
            left,
            top,
            width,
            height,
            (left - sourceLeft) * scale,
            (top - sourceTop) * scale,
            width * scale,
            height * scale,
        );
    }, [loadedImage, samplePoint, sampleSize]);

    useEffect(() => {
        return () => {
            if (loadedImage) {
                URL.revokeObjectURL(loadedImage.url);
            }
        };
    }, [loadedImage]);

    const loadImage = async (file?: File) => {
        if (!file) {
            return;
        }

        const requestId = ++uploadRequestId.current;
        const hasSupportedExtension = /\.(png|jpe?g|webp)$/i.test(file.name);
        if (!SUPPORTED_IMAGE_TYPES.has(file.type) && !(file.type === "" && hasSupportedExtension)) {
            setIsLoadingImage(false);
            setUploadError("Choose a PNG, JPEG, or WebP image.");
            return;
        }

        if (file.size > MAX_FILE_SIZE) {
            setIsLoadingImage(false);
            setUploadError("Images must be 20 MiB or smaller.");
            return;
        }

        setIsLoadingImage(true);
        setUploadError("");
        const url = URL.createObjectURL(file);
        const image = new Image();
        image.src = url;

        try {
            await image.decode();
            if (requestId !== uploadRequestId.current) {
                URL.revokeObjectURL(url);
                return;
            }

            if (image.naturalWidth * image.naturalHeight > MAX_IMAGE_PIXELS) {
                URL.revokeObjectURL(url);
                setIsLoadingImage(false);
                setUploadError("Images must be 20 megapixels or smaller.");
                return;
            }

            setLoadedImage({ fileName: file.name, image, url });
            setIsLoadingImage(false);
            setUploadError("");
        } catch {
            URL.revokeObjectURL(url);
            if (requestId === uploadRequestId.current) {
                setIsLoadingImage(false);
                setUploadError("This image could not be opened. Try a PNG, JPEG, or WebP file.");
            }
        }
    };

    useEffect(() => {
        const handlePaste = (event: ClipboardEvent) => {
            const target = event.target;
            if (target instanceof HTMLElement && (target.isContentEditable || target.closest("input, textarea, select"))) {
                return;
            }

            const imageItem = Array.from(event.clipboardData?.items ?? []).find(
                (item) => item.kind === "file" && item.type.startsWith("image/"),
            );
            const file = imageItem?.getAsFile();
            if (!file) {
                return;
            }

            event.preventDefault();
            void loadImage(file);
        };

        window.addEventListener("paste", handlePaste);
        return () => window.removeEventListener("paste", handlePaste);
    }, [loadImage]);

    const handleDrop = (event: DragEvent<HTMLLabelElement>) => {
        event.preventDefault();
        setIsDragging(false);
        void loadImage(event.dataTransfer.files[0]);
    };

    const clearImage = () => {
        uploadRequestId.current += 1;
        setLoadedImage(null);
        setIsLoadingImage(false);
        setSamplePoint(null);
        setSampledColor(null);
        setSampleError("");
        setUploadError("");
    };

    const renderMatches = (matches: ChannelColorMatch[]) => (
        <ul className="max-h-[32rem] space-y-2 overflow-y-auto pr-1">
            {matches.map((match) => {
                const isSelected = match.color.id === selectedMatchId;

                return (
                    <li key={match.color.id}>
                        <button
                            type="button"
                            onClick={() => setSelectedMatchId(match.color.id)}
                            aria-pressed={isSelected}
                            className={`w-full rounded-xl border px-3 py-2.5 text-left transition ${
                                isSelected
                                    ? "border-fuchsia-300 bg-fuchsia-50"
                                    : "border-gray-200 bg-white hover:border-fuchsia-200 hover:bg-fuchsia-50/40"
                            }`}
                        >
                            <span className="flex items-start gap-3">
                                <span
                                    aria-hidden="true"
                                    className="mt-0.5 h-7 w-7 shrink-0 rounded-md border border-gray-200"
                                    style={{ backgroundColor: getChannelSwatch(match) }}
                                />
                                <span className="min-w-0 flex-1">
                                    <span className="block truncate text-sm font-semibold text-gray-900">
                                        {match.color.COLOUR_NAME}
                                    </span>
                                    <span className="block truncate text-xs text-gray-500">{match.color.MAKE}</span>
                                    <span className="mt-1 block text-xs text-gray-500">Similarity {match.score}%</span>
                                </span>
                            </span>
                        </button>
                    </li>
                );
            })}
        </ul>
    );

    return (
        <div className="space-y-6">
            <header>
                <h1 className="text-xl font-bold text-gray-900">Match a paint from an image</h1>
                <p className="mt-1 text-sm text-gray-600">
                    Choose a photo or screenshot, then sample a point to find similar Forza paint colors. Images stay on this device and are never uploaded.
                </p>
            </header>

            <section className="space-y-4 rounded-2xl border border-gray-200 bg-gray-50 p-4 md:p-5">
                <div className="flex items-center justify-between gap-3">
                    <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-500">Source image</h2>
                    {loadedImage && (
                        <button
                            type="button"
                            onClick={clearImage}
                            className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 hover:border-fuchsia-300 hover:bg-fuchsia-50"
                        >
                            Clear image
                        </button>
                    )}
                </div>

                <label
                    onDragOver={(event) => {
                        event.preventDefault();
                        setIsDragging(true);
                    }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={handleDrop}
                    className={`group relative flex min-h-36 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-4 py-6 text-center transition-colors ${
                        isDragging
                            ? "border-fuchsia-400 bg-fuchsia-50"
                            : "border-gray-300 bg-white hover:border-fuchsia-300 hover:bg-fuchsia-50/40"
                    }`}
                >
                    <input
                        type="file"
                        accept="image/png,image/jpeg,image/webp,.png,.jpg,.jpeg,.webp"
                        className="peer sr-only"
                        onChange={(event) => {
                            void loadImage(event.currentTarget.files?.[0]);
                            event.currentTarget.value = "";
                        }}
                    />
                    <span className="font-semibold text-gray-800 peer-focus-visible:rounded peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-fuchsia-500">
                        Drop, browse, or paste an image
                    </span>
                    <span className="mt-1 text-xs text-gray-500">PNG, JPEG, or WebP - up to 20 MiB</span>
                </label>

                {isLoadingImage && <p role="status" className="text-sm text-gray-600">Loading and checking image...</p>}
                {uploadError && <p role="alert" className="text-sm text-amber-700">{uploadError}</p>}

                {loadedImage && (
                    <div className="space-y-3">
                        <p className="truncate text-xs text-gray-500">{loadedImage.fileName}</p>
                        <div className="flex justify-center rounded-xl border border-gray-200 bg-gray-100 p-2">
                            <button
                                type="button"
                                onClick={handleImageClick}
                                aria-label="Select a point in the image to sample its color"
                                className="relative inline-flex max-w-full cursor-crosshair rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-fuchsia-500"
                            >
                                <img
                                    src={loadedImage.url}
                                    alt="Uploaded image for color sampling"
                                    draggable={false}
                                    className="block max-h-[34rem] max-w-full select-none object-contain"
                                />
                                {samplePoint && sampleSize > 1 && (
                                    <span
                                        aria-hidden="true"
                                        className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 border border-dashed border-white bg-fuchsia-400/10 shadow-[0_0_0_1px_#111827]"
                                        style={{
                                            left: `${((samplePoint.x + 0.5) / loadedImage.image.naturalWidth) * 100}%`,
                                            top: `${((samplePoint.y + 0.5) / loadedImage.image.naturalHeight) * 100}%`,
                                            width: `${(sampleSize / loadedImage.image.naturalWidth) * 100}%`,
                                            height: `${(sampleSize / loadedImage.image.naturalHeight) * 100}%`,
                                        }}
                                    />
                                )}
                                {samplePoint && (
                                    <span
                                        aria-hidden="true"
                                        className="pointer-events-none absolute h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow-[0_0_0_1px_#111827]"
                                        style={{
                                            left: `${((samplePoint.x + 0.5) / loadedImage.image.naturalWidth) * 100}%`,
                                            top: `${((samplePoint.y + 0.5) / loadedImage.image.naturalHeight) * 100}%`,
                                        }}
                                    />
                                )}
                            </button>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
                            <fieldset>
                                <legend className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
                                    Sample area
                                </legend>
                                <div className="flex flex-wrap gap-1 rounded-lg border border-gray-200 bg-white p-1">
                                    {([1, 9, 21, 41] as const).map((size) => (
                                        <button
                                            key={size}
                                            type="button"
                                            aria-pressed={sampleSize === size}
                                            onClick={() => handleSampleSizeChange(size)}
                                            className={`rounded-md px-3 py-1.5 text-sm font-medium ${
                                                sampleSize === size
                                                    ? "bg-gray-900 text-white"
                                                    : "text-gray-600 hover:bg-gray-100"
                                            }`}
                                        >
                                            {size === 1 ? "Single pixel" : `${size} x ${size}`}
                                        </button>
                                    ))}
                                </div>
                            </fieldset>

                            <div className="flex items-center gap-3">
                                {samplePoint && (
                                    <div className="relative h-[110px] w-[110px] shrink-0 overflow-hidden rounded-lg border border-gray-300 bg-white">
                                        <canvas
                                            ref={magnifierRef}
                                            width={110}
                                            height={110}
                                            role="img"
                                            aria-label="Magnified area around the selected point"
                                            className="block h-full w-full"
                                        />
                                        <span aria-hidden="true" className="pointer-events-none absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 border border-white shadow-[0_0_0_1px_#111827]" />
                                    </div>
                                )}
                                {sampledColor ? (
                                    <div className="flex min-w-0 items-center gap-3">
                                        <div
                                            className="h-12 w-12 shrink-0 rounded-md border border-gray-300"
                                            style={{ backgroundColor: sampledColor.hex }}
                                        />
                                        <div className="min-w-0">
                                            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Sampled color</p>
                                            <p className="font-mono text-sm font-semibold text-gray-900">{sampledColor.hex}</p>
                                            <p className="text-xs text-gray-500">HSB {sampledColor.hsb.map((value) => value.toFixed(2)).join(", ")}</p>
                                        </div>
                                    </div>
                                ) : (
                                    <p className="text-sm text-gray-500">Click a point in the image to sample it.</p>
                                )}
                            </div>
                        </div>
                        {sampleError && <p role="status" className="text-sm text-amber-700">{sampleError}</p>}
                    </div>
                )}
            </section>

            <section className="grid gap-6 lg:grid-cols-[minmax(16rem,0.9fr)_minmax(0,1.1fr)]">
                <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4 md:p-5">
                    <div className="mb-3 flex items-center justify-between gap-3">
                        <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-500">Photo matches</h2>
                    </div>

                    {!sampledColor ? (
                        <p className="text-sm text-gray-500">Sample a point in the image to see matching paints.</p>
                    ) : (
                        <>
                            <div>
                                <div className="mb-2 flex items-center justify-between gap-3">
                                    <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500">Base paint (Color 1)</h3>
                                    <span className="text-xs text-gray-500">{photoMatches.primary.length} shown</span>
                                </div>
                                {photoMatches.primary.length > 0
                                    ? renderMatches(photoMatches.primary)
                                    : <p className="text-sm text-gray-500">No base paint matches found.</p>}
                            </div>

                            <div className="mt-6 border-t border-gray-200 pt-4">
                                <div className="mb-2 flex items-center justify-between gap-3">
                                    <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500">Flake colors (Color 2)</h3>
                                    <span className="text-xs text-gray-500">
                                        {Math.min(photoMatches.secondary.length, SECONDARY_MATCH_LIMIT)} shown
                                    </span>
                                </div>
                                {photoMatches.secondary.length > 0
                                    ? renderMatches(photoMatches.secondary.slice(0, SECONDARY_MATCH_LIMIT))
                                    : <p className="text-sm text-gray-500">No secondary colors found.</p>}
                            </div>
                        </>
                    )}
                </div>

                <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5 md:p-6">
                    {selectedMatch ? (
                        <>
                            <h2 className="mb-1 text-lg font-bold text-gray-900">{selectedMatch.COLOUR_NAME}</h2>
                            <p className="mb-6 text-sm text-gray-500">{selectedMatch.MAKE}</p>
                            <div className="flex flex-col gap-8 xl:flex-row">
                                <ColorInfo selectedColor={selectedMatch} />
                                <ColorPreview selectedColor={selectedMatch} />
                            </div>
                        </>
                    ) : (
                        <p className="text-sm text-gray-500">Choose a matching paint to see its HSB values and preview.</p>
                    )}
                </div>
            </section>
        </div>
    );
}

export const clientLoader = async () => {
    const response = await fetch(`${import.meta.env.BASE_URL}colors.json`);
    return response.json();
};

clientLoader.hydrate = true;