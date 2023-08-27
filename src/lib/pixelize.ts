export const getPixelizedEmoji = (emoji: string, size = 128) => {
  const originalSize = 64;

  const c = document.createElement("canvas");
  const ctx = c.getContext("2d")!;
  c.width = originalSize;
  c.height = originalSize;
  ctx.imageSmoothingEnabled = false;

  ctx.font = `${originalSize - 2}px Impact, sans-serif-black`;
  //context.textAlign = textAlign
  // ctx.strokeStyle = 'black'
  // ctx.lineWidth = 4
  // ctx.strokeText(text, x, y)
  // ctx.fillStyle = color
  ctx.fillText(emoji, 0, originalSize - 8); // 8?

  const c2 = document.createElement("canvas");
  c2.width = originalSize;
  c2.height = originalSize;
  const ctx2 = c2.getContext("2d")!;
  ctx2.drawImage(
    c2,
    0,
    0,
    originalSize,
    originalSize,
    0,
    0,
    originalSize / 2,
    originalSize / 2
  );

  ctx.clearRect(0, 0, originalSize, originalSize);
  c.width = size;
  c.height = size;
  ctx.drawImage(c, 0, 0, originalSize / 2, originalSize / 2, 0, 0, size, size);
  return c.toDataURL();
};
