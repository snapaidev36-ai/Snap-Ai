import 'server-only';

import path from 'path';
import { mkdir, writeFile, readFile } from 'fs/promises';

const GENERATED_IMAGES_DIR = path.join(
  process.cwd(),
  'storage',
  'generated-images',
);

async function ensureGeneratedImagesDirectory() {
  await mkdir(GENERATED_IMAGES_DIR, { recursive: true });
}

function getGeneratedImageFilePath(imageId: string) {
  return path.join(GENERATED_IMAGES_DIR, `${imageId}.png`);
}

export async function saveGeneratedImageFromUrl(
  imageId: string,
  imageUrl: string,
) {
  await ensureGeneratedImagesDirectory();

  const response = await fetch(imageUrl);
  if (!response.ok) {
    throw new Error('Unable to download generated image');
  }

  const arrayBuffer = await response.arrayBuffer();
  const filePath = getGeneratedImageFilePath(imageId);
  await writeFile(filePath, Buffer.from(arrayBuffer));

  return filePath;
}

export async function readGeneratedImage(imageId: string) {
  return readFile(getGeneratedImageFilePath(imageId));
}
