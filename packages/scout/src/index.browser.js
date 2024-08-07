// watches chaturbate for go live 

import puppeteer from 'puppeteer-extra';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import StealthPlugin from 'puppeteer-extra-plugin-stealth'
import delay from 'delay'
import ReplPlugin from 'puppeteer-extra-plugin-repl'
import fsp from 'fs/promises';
import repl from 'puppeteer-extra-plugin-repl';

const __dirname = dirname(fileURLToPath(import.meta.url));
const browserDataDir = __dirname+'/futurenet-scout-datadir';


const searchInputSelector = 'body > app-root > div > div.site-wrapper.nav-bar-visible.nav-bar-top-visible > div > app-explore-route > div > app-account-explore-route > div > input'
const followButtonSelector = "xpath///app-account-follow-button/div/xd-localization-string[contains(., 'Follow')]"
const onlineIndicator = 'a.online-indicator.is-live'

// @todo Get this value from Strapi
const channels = [
    'avabrooks'
]


const scrollDown = async (page) => {
  console.log('scrolling down')
  await page.keyboard.press('PageDown')
  await page.evaluate(async () => {
    window.scrollBy(0, 500);
  });
}

const handleOnlineChannel = async (page) => {
  const href = await page.evaluate(async () => {
    const onlineIndicator = 'a.online-indicator.is-live'
    const href = document.querySelector(onlineIndicator).href
    return href
  })
  console.log(`${href} is online!`)
  await fsp.appendFile('./data.csv', `${new Date().toISOString()},${href}\n`)
}

/**
 * Open up a tab to the channel.
 * Intercept websockets events which tell us when the channel is online
 */
const monitor = async (browser, channel) => {
    if (!browser) throw new Error('monitor requires page arg');
    if (!channel) throw new Error('monitor requires channel arg');
    console.log(`monitoring ${channel}`)
    const page = await browser.newPage();

    await page.setRequestInterception(true);
    
    const url = await new Promise((resolve) => {
        page.on('request', interceptRequest => {
            const url = interceptRequest.url();
            console.log(url)
            if (url.startsWith('wss://realtime')) {
                console.log(`request! ${interceptRequest.url()} ${JSON.stringify(interceptRequest.headers(), null, 2)}`);
                resolve(interceptRequest.url());
            }
            interceptRequest.continue();
        });
  
        page.goto(`https://chaturbate.com/${channel}`);
    })

    await page.repl()
}

const dash = async (page, channel) => {
  console.log('check')
  await page.goto(`https://chaturbate.com/${channel}`)

  
  // look for is-live indicator
  try {
    console.log('waiting for home page')
    await page.waitForSelector('div.stories-scroll-container', { timeout: 15000 })
    console.log('waiting for online indicators')
    await page.waitForSelector(onlineIndicator, { timeout: 10000 })
    console.log(`FOUND online channel! ${JSON.stringify(onlineIndicator,  null, 2)}`);
    handleOnlineChannel(page)
    delay(1000)
  } catch (e) {
    console.error(e)
    console.log('error on the dash. lets move on.')
  }
}

const discover = async (page) => {

  // Navigate the page to a URL
  await page.goto('https://fansly.com/explore/discover');


  console.log('wait for search input')
  await page.waitForSelector(searchInputSelector)
  
  // console.log('click search input')
  // await page.click(searchInputSelector)

  console.log('type a random letter')
  const letter = (() => {
    const letters = 'abcdefghijklmnopqrstuvwxyz'
    const randomIndex = Math.floor(Math.random() * letters.length);
    return letters[randomIndex];
  })()
  await page.type(searchInputSelector, letter)



  // // Start an interactive REPL here with the `page` instance.
  // await page.repl()
  // // Afterwards start REPL with the `browser` instance.
  // await browser.repl()

  let go = true
  setTimeout(() => {
    go = false
  }, 1000*30*1) // ~2 minutes of following

  while (go) {
    try {
      console.log('Wait for Follow/Unfollow buttons')
      try {
        await page.waitForSelector(followButtonSelector, { timeout: 1000 })
        await page.click(followButtonSelector, { timeout: 1000 })
      } catch {}

      // look for is-live indicator
      try {
        await page.waitForSelector(onlineIndicator, { timeout: 100 })
        console.log(`FOUND online channel! ${JSON.stringify(onlineIndicator,  null, 2)}`);
        handleOnlineChannel(page)
      } catch (e) {
        // console.log('online channel not found')
      }

      scrollDown(page)
      await page.keyboard.press('PageDown')
    } catch (e) {
      console.error('Error while waiting for follow button')
      console.error(e)
    }
    await delay(15000)
  }
}

(async () => {
  // Launch the browser and open a new blank page
  puppeteer.use(StealthPlugin())
  puppeteer.use(ReplPlugin())
  const browser = await puppeteer.launch({
    headless: false,
    args: [
        `--user-data-dir=${browserDataDir}`
    ]
  });

  
  for (const ch of channels) {
    await monitor(browser, ch)
    // await dash(page)
    // await discover(page) // discover & follow
    // await dash(page)     // dashboard & see who's live
  }

  


})();