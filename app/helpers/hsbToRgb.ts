/**
 * Turns a forza HSB value into an RGB value that can be used to provide previews.
 * 
 * For example, If this method were called with the Porsche Irish Green HSB value:
 * convertDecimalHsbToRgb(.39, .71, .36), you would get the RGB value [27, 92, 49] 
 * 
 * @param decimalHue 
 * @param saturation 
 * @param brightness 
 * @returns {number[]} - A length 3 array representing red/green/blue values
 */
function convertDecimalHsbToRgb(decimalHue: number, saturation: number, brightness: number) {
    // Hue is the angle around the color wheel
    let hue = decimalHue * 360;

    // Calculate chroma, the maximum color intensity
    let chroma = saturation * brightness;

    // Calculate the intermediate values
    let x = chroma * (1 - Math.abs((hue / 60) % 2 - 1));
    let m = brightness - chroma;

    // Initialize RGB values
    let red, green, blue;

    // Determine the RGB values based on the hue range
    if (hue >= 0 && hue < 60) {
        [red, green, blue] = [chroma, x, 0];
    } else if (hue >= 60 && hue < 120) {
        [red, green, blue] = [x, chroma, 0];
    } else if (hue >= 120 && hue < 180) {
        [red, green, blue] = [0, chroma, x];
    } else if (hue >= 180 && hue < 240) {
        [red, green, blue] = [0, x, chroma];
    } else if (hue >= 240 && hue < 300) {
        [red, green, blue] = [x, 0, chroma];
    } else if (hue >= 300 && hue < 360) {
        [red, green, blue] = [chroma, 0, x];
    }

    // Adjust RGB values by adding the brightness factor
    let finalRed = Math.round((red! + m) * 255);
    let finalGreen = Math.round((green! + m) * 255);
    let finalBlue = Math.round((blue! + m) * 255);

    return [finalRed, finalGreen, finalBlue];
}
