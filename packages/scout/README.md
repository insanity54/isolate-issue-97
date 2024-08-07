# scout

Vtuber data acquisition. Anything having to do with external WWW data acquisition goes in this module.

## Features

  * [x] Ingests going live notification e-mails
  * [ ] Sends `start_recording` signals to @futurenet/capture
  * [x] Fetches vtuber data from platform
    * [x] image
    * [x] themeColor
    * [x] displayName
  * [x] Platform Support
    * [x] fansly
    * [x] chaturbate


## Design requirements

  * [ ] get watched channels list from Strapi
  * [ ] every 3 mins, watch/unwatch based on channels list
    * [ ] watch important sources for go-live notifications      
        * [ ] CB tab
        * [ ] email inbox
  * [ ] alerts realtime server when watched room goes live
  * [ ] logs chat messages
  * [ ] throws errors when unable to connect
  * [ ] runs browser headless
  * [ ] runs in the cloud
  * [x] runs in k8s cluster



## Puppeteer

For when we get to the point where we need it, here are the packages we used with success during past testing.

    "puppeteer": "^22.7.1",
    "puppeteer-extra": "^3.3.6",
    "puppeteer-extra-plugin-repl": "^2.3.3",
    "puppeteer-extra-plugin-stealth": "^2.11.2"