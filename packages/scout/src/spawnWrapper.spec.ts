import { expect } from "chai"
import spawnWrapper from "./spawnWrapper.ts"
import { getRandomRoom } from "./cb.ts"

describe('spawnWrapper', function () {
  describe('integration', function () {
    this.timeout(1000*8)
    let roomUrl: string
    this.beforeAll(async function () {
      roomUrl = (await getRandomRoom()).url
    })
    it('should get a playlistUrl of an active stream', async function () {  
      // the system under test is the network integration
      const {code, output} = await spawnWrapper('yt-dlp', ['-g', roomUrl])
      expect(code).to.equal(0)
      expect(output).to.match(/https:\/\/.*\.m3u8/)
    })
    // these tests are flaky because the rooms used will not always be in the same state
    xit('should handle when the room is offline', async function () {
      const {code, output} = await spawnWrapper('yt-dlp', ['-g', 'chaturbate.com/48507961285'])
      expect(code).to.equal(1)
      expect(output).to.match(/Room is currently offline/)
    })
    xit('should handle when the room is passworded', async function () {
      const {code, output} = await spawnWrapper('yt-dlp', ['-g', 'chaturbate.com/projektmelody'])
      expect(code).to.equal(1)
      expect(output).to.match(/Unable to find stream URL/)
    })
  })
})