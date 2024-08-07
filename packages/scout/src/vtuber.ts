import dotenv from 'dotenv';
dotenv.config({
    path: '../../.env',
});
    
import { type IVtuber } from '@futurenet/types';
import twitter from './twitter.js';
import fansly from './fansly.js';

/**
 * Acquire a vtuber image from the www
 *
 * Sources preference
 *   1. Twitter
 *   2. Fansly
 *
 * Our task is to download an avatar image of the vtuber.
 * A slug is good for pulling a record from the database. From there, we can see any social medias such as Twitter or Fansly.
 * Twitter is preferred.
 *
 * We depend on one of these social media URLs. If there is neither Twitter nor Fansly listed, we throw an error.
 *
 * @param {IVtuber} vtuber       -- vtuber instance from Strapi
 * @returns {string} filePath   -- path on disk where the image was saved
 */
export async function getImage(vtuber: IVtuber): Promise<string> {
  if (!vtuber) throw new Error('first arg must be vtuber instance');

  const { twitter: twitterUrl, fanslyId: fanslyId } = vtuber.attributes;
  const twitterUsername = twitterUrl && twitterUrl.match(/@(\w+)/)?.[1];

  let img: string;
  if (twitterUrl) {
    img = await twitter.data.image(twitterUsername);
  } else if (fanslyId) {
    img = await fansly.data.image(fanslyId);
  } else {
    const msg = `while attempting to get vtuber image, there was neither twitterUrl nor fanslyId listed. One of these must exist for us to download an image.\nvtuber=${JSON.stringify(vtuber, null, 2)}`;
    console.error(msg);
    throw new Error(msg);
  }
  return img;
}