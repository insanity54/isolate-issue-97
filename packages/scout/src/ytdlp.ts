import spawnWrapper from './spawnWrapper.ts'
import 'dotenv/config'

const maxRetries = 3

export class ExhaustedRetriesError extends Error {
  constructor(message?: string) {
    super(message)
    Object.setPrototypeOf(this, ExhaustedRetriesError.prototype)
    this.name = this.constructor.name
    this.message = `ExhaustedRetries: We retried the request the maximum amount of times. maxRetries of ${maxRetries} was reached.`
  }
  getErrorMessage() {
    return this.message
  }
}

export class RoomOfflineError extends Error {
  constructor(message?: string) {
    super(message)
    Object.setPrototypeOf(this, RoomOfflineError.prototype)
    this.name = this.constructor.name
    this.message = `RoomOffline. ${this.message}`
  }
  getErrorMessage() {
    return this.message
  }
}



export async function getPlaylistUrl (roomUrl: string, proxy = false, retries = 0): Promise<string> {
  console.log(`getPlaylistUrl roomUrl=${roomUrl}, proxy=${false}, retries=${retries}`)
  let args = ['-g', roomUrl]
  if (proxy) {
    if (!process.env.HTTP_PROXY) throw new Error('HTTP_PROXY is undefined in env');
    args = args.concat(['--proxy', process.env.HTTP_PROXY!])
  }
  const { code, output } = await spawnWrapper('yt-dlp', args)
  if (output.match(/HTTP Error 403/)) {
    // we were likely blocked by Cloudflare
    // we make the request a second time, this time via proxy
    if (retries < maxRetries) return getPlaylistUrl(roomUrl, true, retries+=1);
    else throw new ExhaustedRetriesError();
  } else if (output.match(/Unable to find stream URL/)) {
    // sometimes this happens. a retry is in order.
    if (retries < maxRetries) return getPlaylistUrl(roomUrl, proxy, retries+=1);
    else throw new ExhaustedRetriesError()
  } else if (code === 0 && output.match(/https:\/\/.*\.m3u8/)) {
    // this must be an OK result with a playlist
    return output
  } else if (code === 1 && output.match(/Room is currently offline/)) {
    throw new RoomOfflineError()
  } else {
    console.error('exotic scenario')
    const msg = `We encountered an exotic scenario where code=${code} and output=${output}. Admin: please patch the code to handle this scenario.`
    console.error(msg)
    throw new Error(msg)
  }
}

export default {
  getPlaylistUrl
}