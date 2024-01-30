export function hexToHsb(hexColor: string): [number, number, number] {
    // Validate the hex color code
    if (!hexColor.match(/^#?([0-9A-Fa-f]{3}){1,2}$/)) {
        return [0, 0, 0];
    }

    // Remove '#' if present and expand shorthand hex to full format
    hexColor = hexColor.replace(/^#/, '');
    if (hexColor.length === 3) {
        hexColor = hexColor.split('').map(char => char + char).join('');
    }

    // Convert hex to RGB and Normalize the value to be [0,1] instead of [0,255]
    const r = parseInt(hexColor.substring(0, 2), 16) / 255;
    const g = parseInt(hexColor.substring(2, 4), 16) / 255;
    const b = parseInt(hexColor.substring(4, 6), 16) / 255;

    // Find the max and min values
    const maxColor = Math.max(r, g, b);
    const minColor = Math.min(r, g, b);

    // Brightness is the maximum of normalized R, G, and B values
    const brightness = maxColor;

    // Saturation is based on the difference of the max and min values
    const delta = maxColor - minColor;
    let saturation;

    if (maxColor === 0) {
        saturation = 0;
    } else {
        saturation = (maxColor - minColor) / maxColor;
    }

    // Hue is based on the position of the max value and the difference between the other components
    let hue = 0;

    if (maxColor === minColor) {
        hue = 0;
    } else if (maxColor === r) {
        hue = 60 * ((g - b) / (maxColor - minColor)) % 360
    } else if (maxColor === g) {
        hue = 60 * ((b - r) / (maxColor - minColor)) + 120
    } else if (maxColor === b) {
        hue = 60 * ((r - g) / (maxColor - minColor)) + 240
    }

    // Take care of any negative values
    hue = (hue + 360) % 360;

    // normalize hue from [0,1] instead of [0,360]
    hue /= 360;

    // Return HSB values as a tuple
    return [hue, saturation, brightness];
};
