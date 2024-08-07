import { fpSlugify, getTmpFile, download, getPackageVersion, __dirname } from './index.js'
import { expect } from 'chai'
import { describe } from 'mocha'
import { join } from 'path'

describe('utils', function () {
    describe('fpSlugify', function () {
        it('should remove all capitalization and uppercase and spaces and special characters', function () {
            expect(fpSlugify('ProjektMelody')).to.equal('projektmelody')
            expect(fpSlugify('CJ_Clippy')).to.equal('cjclippy')
        })
    })
    describe('getTmpFile', function () {
        it('should give a /tmp/<random>_<basename> path', function () {
            expect(getTmpFile('my-cool-image.webp')).to.match(/\/tmp\/.*_my-cool-image\.webp/)
            expect(getTmpFile('video.mp4')).to.match(/\/tmp\/.*_video\.mp4/)
        })
    })
    // disabled because it's an integration test, slow
    xdescribe('download', function () {
        it('should get the file', async function () {
            const file = await download({ url: 'https://futurenet-b2.b-cdn.net/sample.webp' })
            expect(file).to.match(/\/tmp\/.*sample\.webp$/)
        })
    })
    describe('getPackageVersion', function () {
        it('should get the version from package.json', function () {
            expect(getPackageVersion(join(__dirname, '../package.json'))).to.match(/\d+\.\d+\.\d+/)
        })
        it('should handle a relative path', function () {
            expect(getPackageVersion('../package.json')).to.match(/\d+\.\d+\.\d+/)
        })
    })
})