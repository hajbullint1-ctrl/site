/** Shrink a picked photo so it can be stored with the site. */
export async function compressImageFile(file: File): Promise<string> {
  if (!file.type.startsWith("image/")) throw new Error("bad_image");
  if (file.size > 12 * 1024 * 1024) throw new Error("image_too_large");
  const bitmap = await createImageBitmap(file);
  const maxEdge = 1400;
  const scale = Math.min(1, maxEdge / Math.max(bitmap.width, bitmap.height));
  const width = Math.max(1, Math.round(bitmap.width * scale));
  const height = Math.max(1, Math.round(bitmap.height * scale));
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    bitmap.close();
    throw new Error("bad_image");
  }
  ctx.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();
  let quality = 0.82;
  let url = canvas.toDataURL("image/jpeg", quality);
  while (url.length > 700_000 && quality > 0.5) {
    quality -= 0.08;
    url = canvas.toDataURL("image/jpeg", quality);
  }
  if (url.length > 900_000) throw new Error("image_too_large");
  return url;
}
