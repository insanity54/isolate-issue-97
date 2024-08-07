
import * as htmlparser2 from "htmlparser2";
import { load } from 'cheerio'
import { download } from '@futurenet/utils';
import pRetry, { AbortError } from 'p-retry';

if (!process.env.SCOUT_NITTER_ACCESS_KEY) throw new Error('SCOUT_NITTER_ACCESS_KEY was undefined in env');
if (!process.env.SCOUT_NITTER_URL) throw new Error('SCOUT_NITTER_URL was undefined in env');



const regex = {
    username: new RegExp(/https:\/\/(?:twitter\.com|x\.com)\/([a-zA-Z0-9_]+)/i)
}

const normalize = (url) => {
    if (!url) throw new Error('normalized received a null or undefined url.');
    return fromUsername(twitter.regex.username.exec(url).at(1))
}


const image = async function image (twitterUsername) {
    if (!twitterUsername) throw new Error('first arg to twitter.data.image must be a twitterUsername. It was undefined.');
    const requestDataFromNitter = async () => {
        const url = `${process.env.SCOUT_NITTER_URL}/${twitterUsername}/rss?key=${process.env.SCOUT_NITTER_ACCESS_KEY}`
        // console.log(`fetching from url=${url}`)
        const response = await fetch(url);
        // Abort retrying if the resource doesn't exist
        if (response.status === 404) {
            throw new AbortError(response.statusText);
        }
        return response.text();
    }
    const body = await pRetry(requestDataFromNitter, { retries: 5 });
    try {
        const dom = htmlparser2.parseDocument(body);
        const $ = load(dom, { _useHtmlParser2: true })
        const urls = $('url:contains("profile_images")').first()
        const downloadedImageFile = await download({ url: urls.text() })
        return downloadedImageFile
    } catch (e) {
        console.error(`while fetching rss from nitter, the following error was encountered.`)
        console.error(e)
    }
}

const fromUsername = (username) => `https://x.com/${username}`

const url = {
    normalize,
    fromUsername
}

const data = {
    image
}

const twitter = {
    regex,
    url,
    data,
}


export default twitter