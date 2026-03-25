import { mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import { join } from 'path';

const configuredRoot = process.env.UPLOAD_DIR?.trim();

export const UPLOAD_DIR = configuredRoot
  ? join(configuredRoot)
  : join(process.cwd(), 'storage', 'uploads');

export const LEGACY_PUBLIC_UPLOAD_DIR = join(process.cwd(), 'public', 'uploads');

export async function ensureUploadDir() {
  if (!existsSync(UPLOAD_DIR)) {
    await mkdir(UPLOAD_DIR, { recursive: true });
  }
}

export function buildUploadPublicPath(filename: string) {
  return `/uploads/${filename}`;
}

export function resolveUploadFilePath(filename: string) {
  return join(UPLOAD_DIR, filename);
}

export function resolveLegacyUploadFilePath(filename: string) {
  return join(LEGACY_PUBLIC_UPLOAD_DIR, filename);
}
