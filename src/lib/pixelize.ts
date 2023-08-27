export const getPixelizedEmoji = (emoji: string, size = 32) => {
  const originalSize = 128;

  const c = document.createElement("canvas");
  const ctx = c.getContext("2d")!;
  c.width = originalSize;
  c.height = originalSize;
  ctx.imageSmoothingEnabled = false;

  ctx.font = `${originalSize - 10}px Impact, sans-serif-black`;
  //context.textAlign = textAlign
  // ctx.strokeStyle = 'black'
  // ctx.lineWidth = 4
  // ctx.strokeText(text, x, y)
  // ctx.fillStyle = color
  ctx.fillText(emoji, 0, originalSize - 24); // 8?

  const c2 = document.createElement("canvas");
  c2.width = originalSize / 2;
  c2.height = originalSize / 2;
  const ctx2 = c2.getContext("2d")!;
  ctx2.imageSmoothingEnabled = false;
  ctx2.drawImage(
    ctx.canvas,
    0,
    0,
    originalSize,
    originalSize,
    0,
    0,
    originalSize / 5,
    originalSize / 5
  );

  ctx.clearRect(0, 0, originalSize, originalSize);
  c.width = size;
  c.height = size;
  ctx.drawImage(
    ctx2.canvas,
    0,
    0,
    originalSize / 5,
    originalSize / 5,
    0,
    0,
    size,
    size
  );
  return c.toDataURL();
};
