/**
 * Compresses an image file on the client side using HTML5 Canvas.
 * Resizes the image to a maximum dimension of 1200px (width or height)
 * and compresses it to a WebP or JPEG image with 0.8 quality.
 */
export async function compressImage(
  file: File,
  maxDimension: number = 1200,
  quality: number = 0.8
): Promise<{
  base64: string;
  mimeType: string;
  originalSize: number;
  compressedSize: number;
}> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Calculate new dimensions keeping aspect ratio
        if (width > height) {
          if (width > maxDimension) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          }
        } else {
          if (height > maxDimension) {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Could not get 2D context from canvas"));
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        // Export as WebP first, fallback to JPEG if not supported
        let mimeType = "image/webp";
        let dataUrl = canvas.toDataURL(mimeType, quality);

        if (!dataUrl.startsWith("data:image/webp")) {
          mimeType = "image/jpeg";
          dataUrl = canvas.toDataURL(mimeType, quality);
        }

        const base64Data = dataUrl.split(",")[1];
        
        // Calculate size of base64 string in bytes roughly
        const compressedSize = Math.round((base64Data.length * 3) / 4);

        resolve({
          base64: base64Data,
          mimeType,
          originalSize: file.size,
          compressedSize,
        });
      };
      img.onerror = (err) => reject(new Error("Failed to load image for compression"));
    };
    reader.onerror = (err) => reject(new Error("Failed to read image file"));
  });
}

/**
 * Calculates reading time in minutes for a given text.
 * Average reading speed: 200 words per minute.
 */
export function calculateReadingTime(text: string): number {
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
}
