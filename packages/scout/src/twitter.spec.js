import { expect } from 'chai'
import twitter from './twitter.js'
import { describe } from 'mocha'
import { tmpFileRegex } from './utils.js'

describe('twitter', function () {
    describe('regex', function () {
        describe('username', function () {
            it('should get the username of the channel', function () {
                expect(twitter.regex.username.exec('https://twitter.com/18Plus').at(1)).to.equal('18Plus')
                expect(twitter.regex.username.exec('https://twitter.com/projektmelody').at(1)).to.equal('projektmelody')
                expect(twitter.regex.username.exec('https://twitter.com/GoodKittenVR').at(1)).to.equal('GoodKittenVR')
                expect(twitter.regex.username.exec('https://x.com/projektmelody').at(1)).to.equal('projektmelody')
                expect(twitter.regex.username.exec('https://x.com/18Plus').at(1)).to.equal('18Plus')
                expect(twitter.regex.username.exec('https://x.com/GoodKittenVR').at(1)).to.equal('GoodKittenVR')
            })
        })
    })
    describe('data', function () {
        this.timeout(1000*30)
        describe('image', function () {
            it("should download the twitter users's avatar and save it to disk", async function () {
                const imgFile = await twitter.data.image('projektmelody')
                expect(imgFile).to.match(tmpFileRegex)
            })
        })
    })
})