/**
 * Watermark utility for permanently stamping the "GRAPHICS PUNCHING" watermark
 * onto images using HTML5 Canvas before downloading or exporting.
 */

export async function downloadWatermarkedImage(
  imageSrc: string,
  rawTitle: string,
  watermarkText: string = 'GRAPHICS PUNCHING'
): Promise<void> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          throw new Error('Canvas 2D context not supported');
        }

        const width = img.naturalWidth || img.width || 1200;
        const height = img.naturalHeight || img.height || 900;

        canvas.width = width;
        canvas.height = height;

        // 1. Draw the base original full-resolution image
        ctx.drawImage(img, 0, 0, width, height);

        // 2. Draw subtle full-grid repeating diagonal watermarks
        ctx.save();
        ctx.translate(width / 2, height / 2);
        ctx.rotate((-25 * Math.PI) / 180);

        const patternFontSize = Math.max(16, Math.round(Math.min(width, height) * 0.035));
        ctx.font = `900 ${patternFontSize}px 'Plus Jakarta Sans', 'Arial Black', sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        const stepX = Math.round(width * 0.45);
        const stepY = Math.round(height * 0.22);
        const maxDist = Math.sqrt(width * width + height * height);

        for (let y = -maxDist; y <= maxDist; y += stepY) {
          for (let x = -maxDist; x <= maxDist; x += stepX) {
            // Shadow
            ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
            ctx.fillText(watermarkText, x + 1.5, y + 1.5);
            // Foreground
            ctx.fillStyle = 'rgba(255, 255, 255, 0.28)';
            ctx.fillText(watermarkText, x, y);
          }
        }
        ctx.restore();

        // 3. Draw Main Central Prominent Watermark Shield
        ctx.save();
        ctx.translate(width / 2, height / 2);
        ctx.rotate((-18 * Math.PI) / 180);

        const mainFontSize = Math.max(28, Math.round(Math.min(width, height) * 0.075));
        ctx.font = `900 ${mainFontSize}px 'Plus Jakarta Sans', 'Arial Black', sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        // Deep multi-layer shadow for visibility on any background (dark/light)
        ctx.shadowColor = 'rgba(0, 0, 0, 0.9)';
        ctx.shadowBlur = Math.round(mainFontSize * 0.4);
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 3;

        // Outline
        ctx.lineWidth = Math.max(3, Math.round(mainFontSize * 0.08));
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.85)';
        ctx.strokeText(watermarkText, 0, 0);

        // Fill
        ctx.fillStyle = '#FFFFFF';
        ctx.fillText(watermarkText, 0, 0);

        // Subtitle badge
        const subFontSize = Math.max(12, Math.round(mainFontSize * 0.3));
        ctx.font = `800 ${subFontSize}px 'Plus Jakarta Sans', sans-serif`;
        ctx.shadowBlur = 4;
        ctx.shadowColor = '#000000';
        ctx.fillStyle = '#FFC400';
        ctx.fillText('SCREEN PRINTING • EMBROIDERY • VECTOR ARTWORK', 0, mainFontSize * 0.65);
        ctx.restore();

        // 4. Bottom Right Official Stamp
        ctx.save();
        const stampFontSize = Math.max(12, Math.round(Math.min(width, height) * 0.025));
        ctx.font = `700 ${stampFontSize}px 'Plus Jakarta Sans', sans-serif`;
        ctx.textAlign = 'right';
        ctx.textBaseline = 'bottom';
        ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        ctx.fillText('WWW.GRAPHICSPUNCHING.COM', width - 20 + 1, height - 16 + 1);
        ctx.fillStyle = '#FFC400';
        ctx.fillText('WWW.GRAPHICSPUNCHING.COM', width - 20, height - 16);
        ctx.restore();

        // 5. Trigger download
        const cleanName = rawTitle
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-|-$/g, '') || 'portfolio-project';

        const filename = `${cleanName}-watermarked.jpg`;

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              // Fallback to dataURL
              const dataUrl = canvas.toDataURL('image/jpeg', 0.95);
              const link = document.createElement('a');
              link.download = filename;
              link.href = dataUrl;
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
              resolve();
              return;
            }

            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.download = filename;
            link.href = url;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            setTimeout(() => URL.revokeObjectURL(url), 1000);
            resolve();
          },
          'image/jpeg',
          0.95
        );
      } catch (err) {
        console.error('Error generating watermarked image blob:', err);
        // Fallback: direct download
        const link = document.createElement('a');
        link.download = `${rawTitle.toLowerCase().replace(/\s+/g, '-')}-preview.jpg`;
        link.href = imageSrc;
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        resolve();
      }
    };

    img.onerror = () => {
      // If cross-origin image fails to load onto canvas, fallback to direct download
      const link = document.createElement('a');
      link.download = `${rawTitle.toLowerCase().replace(/\s+/g, '-')}-preview.jpg`;
      link.href = imageSrc;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      resolve();
    };

    img.src = imageSrc;
  });
}
