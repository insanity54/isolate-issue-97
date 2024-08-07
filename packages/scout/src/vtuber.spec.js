
import { expect } from 'chai'
import { describe } from 'mocha'
import { getImage } from './vtuber.js'
import { tmpFileRegex } from './utils.js'

const vtuberFixture0 = {
    id: 0,
    attributes: {
        slug: 'projektmelody',
        twitter: 'https://x.com/projektmelody',
        fansly: 'https://fansly.com/projektmelody'
    }
}
const vtuberFixture1 = {
    id: 0,
    attributes: {
        slug: 'projektmelody',
        twitter: undefined,
        fanslyId: '284824898138812416'
    }
}

describe('vtuber', function () {
    this.timeout(1000*60)
    describe('getImage', function () {
        it('should download an avatar image from twitter', async function () {
            const file = await getImage(vtuberFixture0)
            expect(file).to.match(tmpFileRegex)
        })
        it('should download an avatar image from fansly', async function () {
            const file = await getImage(vtuberFixture1)
            expect(file).to.match(tmpFileRegex)
        })
    })
})