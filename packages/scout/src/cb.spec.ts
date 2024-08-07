import { describe } from 'mocha'
import { expect } from 'chai';
import { getInitialRoomDossier, getRandomRoom } from './cb.js'

describe('cb', function () {
  describe('integration', function () {
    describe('getInitialRoomDossier', function () {
      this.timeout(1000*16)
      it('should return json', async function () {
        const dossier = await getInitialRoomDossier('https://chaturbate.com/projektmelody')
        expect(dossier).to.have.property('wschat_host', 'dossier was missing wschat_host')
      })
    })
    describe('getRandomRoom', function () {
      it('should return a Room object of an online room', async function () {
        this.timeout(1000*16)
        const room = await getRandomRoom()
        expect(room).to.have.property('url')
        expect(room).to.have.property('name')
        expect(room.name).to.match(/[a-z_]/)
        expect(room.url).to.match(/https:\/\//)
      })
    })
  })
})