import slug from 'slug';
import os from 'node:os';
import fs from 'node:fs';
import { createId } from '@paralleldrive/cuid2';
import { Readable } from 'stream';
import { finished } from 'stream/promises';
import pRetry from 'p-retry';
import { dirname, basename, join, isAbsolute } from 'node:path';
import { fileURLToPath } from 'url';
export const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(fileURLToPath(import.meta.url));
const ua0 = 'Mozilla/5.0 (X11; Linux x86_64; rv:105.0) Gecko/20100101 Firefox/105.0'

export function getPackageVersion(packageJsonPath: string): string {
  if (!packageJsonPath) throw new Error('getPackageVersion requires packageJsonPath as first argument, but it was undefined.');
  if (!isAbsolute(packageJsonPath)) {
    packageJsonPath = join(__dirname, packageJsonPath)
  }
  try {
    const raw = fs.readFileSync(packageJsonPath, { encoding: 'utf-8' })
    const json = JSON.parse(raw)
    return json.version
  } catch (e) {
    console.error('failed to getPackageVersion')
    console.error(e)
    return 'IDK'
  }
}

export function fpSlugify(str: string): string {
  return slug(str, {
    replacement: '-',
    lower: true,
    locale: 'en',
    trim: true,
  });
}

export function getTmpFile(str: string): string {
  return join(os.tmpdir(), `${createId()}_${basename(str)}`);
}

/**
 * 
 * @param {String} url 
 * @returns {String} filePath
 * 
 * greetz https://stackoverflow.com/a/74722818/1004931
 */
export async function download({ url, filePath }: { url: string; filePath?: string }): Promise<string | null> {
  if (!url) throw new Error(`second arg passed to download() must be a {string} url`);
  const fileBaseName = basename(url);
  filePath = filePath || join(os.tmpdir(), `${createId()}_${fileBaseName}`);
  const stream = fs.createWriteStream(filePath);

  const requestData = async () => {
    const response = await fetch(url, {
      headers: {
        'user-agent': ua0,
      },
    });

    const { body } = response;
    if (!body) throw new Error('body was null');
    await finished(Readable.fromWeb(body).pipe(stream));

    // Abort retrying if the resource doesn't exist
    if (response.status === 404) {
      throw new Error(response.statusText);
    }

    return;
  };

  try {
    await pRetry(requestData, { retries: 3 });
  } catch (e) {
    console.error(`utils.download failed to download ${url}`);
    console.error(e);
    return null;
  }
  return filePath;
}

export const tmpFileRegex = /^\/tmp\/.*\.jpg$/;