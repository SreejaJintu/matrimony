/**
 * Processes an uploaded image file into a standard 4:5 portrait format (600x750 px).
 * Automatically center-crops landscape/square photos and focuses on the top-center (face area),
 * ensuring the resulting photo perfectly fits Featured cards, Match cards, and View Profile pages.
 *
 * @param {File} file - The uploaded image file
 * @param {number} targetWidth - Target width in pixels (default: 600)
 * @param {number} targetHeight - Target height in pixels (default: 750, 4:5 ratio)
 * @returns {Promise<File>} - Processed and formatted image File
 */
export const processPhotoToStandardSize = (file, targetWidth = 600, targetHeight = 750) => {
  return new Promise((resolve) => {
    if (!file || !file.type.startsWith('image/')) {
      resolve(file);
      return;
    }

    const img = new Image();
    const reader = new FileReader();

    reader.onload = (e) => {
      img.src = e.target?.result;
    };

    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = targetWidth;
        canvas.height = targetHeight;
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          resolve(file);
          return;
        }

        const sourceAspect = img.width / img.height;
        const targetAspect = targetWidth / targetHeight;

        let sx, sy, sWidth, sHeight;

        if (sourceAspect > targetAspect) {
          // Source is wider than 4:5 (e.g., landscape or square) -> crop sides, keep full height
          sHeight = img.height;
          sWidth = img.height * targetAspect;
          sx = (img.width - sWidth) / 2;
          sy = 0;
        } else {
          // Source is taller than 4:5 -> crop top/bottom with 15% top bias for face framing
          sWidth = img.width;
          sHeight = img.width / targetAspect;
          sx = 0;
          sy = Math.max(0, (img.height - sHeight) * 0.15);
        }

        // Fill background with clean white in case of transparency
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, targetWidth, targetHeight);

        // Draw cropped & fitted image
        ctx.drawImage(img, sx, sy, sWidth, sHeight, 0, 0, targetWidth, targetHeight);

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              resolve(file);
              return;
            }
            const cleanName = file.name.replace(/\.[^/.]+$/, '') + '.jpg';
            const processedFile = new File([blob], cleanName, {
              type: 'image/jpeg',
              lastModified: Date.now(),
            });
            resolve(processedFile);
          },
          'image/jpeg',
          0.92
        );
      } catch (err) {
        console.warn('Canvas photo formatting failed, using original file:', err);
        resolve(file);
      }
    };

    img.onerror = () => resolve(file);
    reader.onerror = () => resolve(file);
    reader.readAsDataURL(file);
  });
};
