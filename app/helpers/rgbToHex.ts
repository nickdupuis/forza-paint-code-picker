/**
 * Converts an RGB triplet (0-255 per channel) into an uppercase hex color string.
 *
 * @param r - Red channel (0-255).
 * @param g - Green channel (0-255).
 * @param b - Blue channel (0-255).
 * @returns A hex color string such as "#FF5500".
 */
export function rgbToHex(r: number, g: number, b: number): string {
    const toHex = (value: number) =>
        Math.max(0, Math.min(255, Math.round(value)))
            .toString(16)
            .padStart(2, "0")
            .toUpperCase();

    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}
