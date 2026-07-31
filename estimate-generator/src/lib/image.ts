'use client';

const MAX_DIMENSION = 400;
export const MAX_LOGO_BYTES = 5 * 1024 * 1024;

/**
 * Reads an uploaded logo and re-encodes it down to `MAX_DIMENSION` on its
 * longest side. Logos go straight into localStorage, which is a ~5 MB budget
 * shared with everything else, so shrinking before storing is not optional.
 */
export async function resizeImageToDataUrl(file: File): Promise<string> {
  if (!file.type.startsWith('image/')) {
    throw new Error('That file is not an image. Please choose a PNG or JPG.');
  }
  if (file.size > MAX_LOGO_BYTES) {
    throw new Error('That image is larger than 5 MB. Please choose a smaller file.');
  }

  const dataUrl = await readAsDataUrl(file);
  const image = await loadImage(dataUrl);

  const scale = Math.min(1, MAX_DIMENSION / Math.max(image.width, image.height));
  const width = Math.max(1, Math.round(image.width * scale));
  const height = Math.max(1, Math.round(image.height * scale));

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext('2d');
  if (!context) return dataUrl;

  context.imageSmoothingQuality = 'high';
  context.drawImage(image, 0, 0, width, height);

  // PNG keeps transparent logo backgrounds intact; JPEG would flatten them to
  // black. Fall back to the original if the canvas is tainted for any reason.
  try {
    return canvas.toDataURL('image/png');
  } catch {
    return dataUrl;
  }
}

function readAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error('Could not read that file.'));
    reader.readAsDataURL(file);
  });
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new window.Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error('Could not read that image.'));
    image.src = src;
  });
}
