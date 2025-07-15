  // Bayer 4x4 ordered dithering matrix - more authentic Game Boy Camera dithering
  const thresholdMap = [
    [0, 128, 32, 160],
    [192, 64, 224, 96],
    [48, 176, 16, 144],
    [240, 112, 208, 80]
  ];

  // More accurate Game Boy Camera color palette (from darkest to lightest)
  const colorsMap = [
    [15, 56, 15],   // Darkest green (almost black)
    [48, 98, 48],   // Dark green
    [139, 172, 15], // Light green
    [155, 188, 15]  // Lightest green (almost white)
  ];

  export function processImage(imageData: ImageData): ImageData {
    const data = imageData.data;
    const width = imageData.width;

    for (let i = 0; i < data.length; i += 4) {
      // Calculate luminance using standard RGB to grayscale conversion
      // TODO: Move the values to constants?
      const luminance = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];

      // Get pixel coordinates
      const x = (i / 4) % width;
      const y = Math.floor(i / 4 / width);

      // Apply Bayer dithering - compare luminance to threshold
      const threshold = thresholdMap[x % 4][y % 4];
      const ditheredValue = luminance + (threshold - 128) * 0.5;

      // Map to 4-color Game Boy palette with better distribution
      let colorIndex = 0;
      if (ditheredValue < 64) {
        colorIndex = 0; // Darkest
      } else if (ditheredValue < 128) {
        colorIndex = 1; // Dark
      } else if (ditheredValue < 192) {
        colorIndex = 2; // Light
      } else {
        colorIndex = 3; // Lightest
      }

      // Apply color
      const [r, g, b] = colorsMap[colorIndex];
      data[i] = r;
      data[i + 1] = g;
      data[i + 2] = b;
    }

    return imageData;
  }
