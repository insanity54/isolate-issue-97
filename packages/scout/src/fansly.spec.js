import { expect } from 'chai'
import fansly from './fansly.js'
import { describe } from 'mocha'

describe('fansly', function () {
    describe('regex', function () {
        describe('username', function () {
            it('should get the username of the channel', function () {
                expect(fansly.regex.username.exec('https://fansly.com/18Plus/posts').at(1)).to.equal('18Plus')
                expect(fansly.regex.username.exec('https://fansly.com/projektmelody/posts').at(1)).to.equal('projektmelody')
                expect(fansly.regex.username.exec('https://fansly.com/GoodKittenVR').at(1)).to.equal('GoodKittenVR')
                expect(fansly.regex.username.exec('https://fansly.com/live/MzLewdieB').at(1)).to.equal('MzLewdieB')
                expect(fansly.regex.username.exec('https://fansly.com/live/340602399334871040').at(1)).to.equal('340602399334871040')
            })
        })
    })
    describe('url', function () {
        describe('fromUsername', function () {
            it('should accept a channel name and give us a valid channel URL', function () {
                expect(fansly.url.fromUsername('projektmelody')).to.equal('https://fansly.com/projektmelody')
                expect(fansly.url.fromUsername('GoodKittenVR')).to.equal('https://fansly.com/GoodKittenVR')
                expect(fansly.url.fromUsername('MzLewdieB')).to.equal('https://fansly.com/MzLewdieB')
                expect(fansly.url.fromUsername('340602399334871040')).to.equal('https://fansly.com/340602399334871040')
            })
        })
        describe('normalize', function () {
            it('should accept a live URL and return a normal channel url.', function () {
                expect(fansly.url.normalize('https://fansly.com/live/projektmelody')).to.equal('https://fansly.com/projektmelody')
                expect(fansly.url.normalize('https://fansly.com/live/340602399334871040')).to.equal('https://fansly.com/340602399334871040')
                expect(fansly.url.normalize('https://fansly.com/live/GoodKittenVR')).to.equal('https://fansly.com/GoodKittenVR')
            })
        })
    })
})