import { CarColor } from "~/types/CarColor";

export type ColorMatch = { color: CarColor; score: number };
export type ChannelColorMatch = ColorMatch & { channel: 1 | 2 };
export type PhotoColorMatches = { primary: ChannelColorMatch[]; secondary: ChannelColorMatch[] };

const PHOTO_BRIGHTNESS_TOLERANCE = 0.25;

export function parseValue(value: string): number | null {
    const parsed = Number.parseFloat(value);
    return Number.isFinite(parsed) ? parsed : null;
}

export function clamp01(value: number): number {
    return Math.min(1, Math.max(0, value));
}

export function normalizeHueValue(value: number): number {
    const wrapped = value % 1;
    return wrapped < 0 ? wrapped + 1 : wrapped;
}

export function hueDistance(a: number, b: number): number {
    const distance = Math.abs(normalizeHueValue(a) - normalizeHueValue(b));
    return Math.min(distance, 1 - distance);
}

export function similarityScore(
    target: [number, number, number],
    candidate: [number, number, number],
): number {
    const hueDiff = hueDistance(target[0], candidate[0]);
    const satDiff = Math.abs(clamp01(target[1]) - clamp01(candidate[1]));
    const briDiff = Math.abs(clamp01(target[2]) - clamp01(candidate[2]));
    const weightedDistance = hueDiff * 0.55 + satDiff * 0.25 + briDiff * 0.2;

    return Math.min(100, Math.max(0, Math.round((1 - weightedDistance) * 100)));
}

/**
 * Ranks dataset colors by how closely their primary HSB values match the target
 * HSB tuple, returning the highest-scoring matches first.
 *
 * @param colors - The paint-code dataset to search.
 * @param target - The target color as a [hue, saturation, brightness] tuple (0-1).
 * @param limit - Maximum number of matches to return.
 */
export function findClosestMatches(
    colors: CarColor[],
    target: [number, number, number],
    limit: number,
): ColorMatch[] {
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
                score: similarityScore(target, [
                    normalizeHueValue(hue),
                    clamp01(saturation),
                    clamp01(brightness),
                ]),
            };
        })
        .filter((entry): entry is ColorMatch => entry !== null)
        .sort((a, b) => b.score - a.score)
        .slice(0, limit);
}

export function findClosestPhotoMatches(
    colors: CarColor[],
    target: [number, number, number],
    limit: number,
): PhotoColorMatches {
    const matches: PhotoColorMatches = { primary: [], secondary: [] };

    for (const color of colors) {
        for (const channel of [1, 2] as const) {
            const hue = parseValue(color[`COLOR_${channel}_HUE`]);
            const saturation = parseValue(color[`COLOR_${channel}_SATURATION`]);
            const brightness = parseValue(color[`COLOR_${channel}_BRIGHTNESS`]);

            if (hue === null || saturation === null || brightness === null) {
                continue;
            }

            const hueDiff = hueDistance(target[0], hue);
            const saturationDiff = Math.abs(clamp01(target[1]) - clamp01(saturation));
            const brightnessDiff = Math.max(
                0,
                Math.abs(clamp01(target[2]) - clamp01(brightness)) - PHOTO_BRIGHTNESS_TOLERANCE,
            );
            const weightedDistance = hueDiff * 0.55 + saturationDiff * 0.25 + brightnessDiff * 0.2;
            const match: ChannelColorMatch = {
                color,
                channel,
                score: Math.min(100, Math.max(0, Math.round((1 - weightedDistance) * 100))),
            };

            matches[channel === 1 ? "primary" : "secondary"].push(match);
        }
    }

    matches.primary.sort((a, b) => b.score - a.score);
    matches.secondary.sort((a, b) => b.score - a.score);

    return {
        primary: matches.primary.slice(0, limit),
        secondary: matches.secondary.slice(0, limit),
    };
}
