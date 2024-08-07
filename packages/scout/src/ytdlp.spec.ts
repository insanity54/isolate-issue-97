import { getRandomRoom } from './cb.ts'
import { expect } from 'chai'
import esmock from 'esmock'
import { mock } from 'node:test'

describe('esmock integration', function () {
  // sanity test to ensure esmock functionality doesn't break
  // here we are overriding the hello.ts module's functionality
  // normally it would return an Earth emoji with Asia visible.
  it('should return a planet Earth emoji with Americas visible', async function () {
    const hello = await esmock('./hello.ts', {
      './icons': { world: '🌎' }
    })
    expect(hello('world')).to.equal('🌎')
    expect(hello()).to.equal('hi')
  })
})

describe('ytdlp', function () {
  
  describe('integration', function () {
    let roomUrl: string;
    this.beforeAll(async function () {
      roomUrl = (await getRandomRoom()).url
    })
  })
  describe('unit', function () {
    it('should handle 403s by using a proxy', async function () {
      this.timeout(2000)
      const ytdlpErrorRequestForbidden = "ERROR: [Chaturbate] projektmelody: Unable to download webpage: HTTP Error 403: Forbidden (caused by <HTTPError 403: 'Forbidden'>); please report this issue on  https://github.com/yt-dlp/yt-dlp/issues?q= , filling out the appropriate issue template. Confirm you are on the latest version using  yt-dlp -U"
      const requestSimulator = mock.fn(() => {
        if (requestSimulator.mock.calls.length === 0) {
          return {
            code: 1,
            output: ytdlpErrorRequestForbidden
          }
        } else {
          return {
            code: 0,
            output: 'https://example.com/playlist.m3u8'
          }
        }
      })

      const ytdlp = await esmock('./ytdlp.ts', {
        // simulate a yt-dlp request getting blocked by Cloudflare
        './spawnWrapper.ts': requestSimulator
      })
      const url = await ytdlp.getPlaylistUrl('chaturbate.com/projektmelody')
      expect(url).to.match(/https:\/\/.*\.m3u8/)
    })
  })
})