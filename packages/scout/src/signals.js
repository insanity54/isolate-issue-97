
import 'dotenv/config'
import qs from 'qs'
import { subMinutes, addMinutes } from 'date-fns'
import { fpSlugify, download } from './utils.js'
import { getProminentColor } from './image.js'
import { getImage } from './vtuber.js'
import fansly from './fansly.js'

// alternative js libraries for postgres notify/wait 
//   * https://github.com/imqueue/pg-pubsub
//   * https://github.com/voxpelli/node-pg-pubsub
//   * https://github.com/andywer/pg-listen

if (!process.env.SCOUT_STRAPI_API_KEY) throw new Error('SCOUT_STRAPI_API_KEY is missing from env');
if (!process.env.STRAPI_URL) throw new Error('STRAPI_URL is missing from env');
if (!process.env.SCOUT_RECENTS_TOKEN) throw new Error('SCOUT_RECENTS_TOKEN is undefined in env');
if (!process.env.CDN_BUCKET_URL) throw new Error('CDN_BUCKET_URL is undefined in env');




/**
 * Create a database record which shows this stream exists
 * 
 * It's kind of complicated, but we do it this way so we don't need a backend batch processor.
 * Instead, Scout takes as much responsibility as possible and does the work that a human would do if they were creating the records.
 * 
 * In Strapi, we are finding or updating or creating the following content-types.
 *   * vtuber
 *   * platform-notification
 *   * stream
 * 
 * It's a 3 step process, with each step outlined in the function body.
 */
export async function createStreamInDb ({ source, platform, channel, date, url, userId }) {
    throw new Error('createStreamInDb is deprecated.');
    
    let vtuberId, streamId

    console.log('>> # Step 1')
    // # Step 1.
    // First we find or create the vtuber
    // The vtuber may already be in the db, so we look for that record. All we need is the Vtuber ID.
    // If the vtuber is not in the db, we create the vtuber record.

    // GET /api/:pluralApiId?filters[field][operator]=value
    const findVtubersFilters = (() => {
        if (platform === 'chaturbate') {
            return { chaturbate: { $eq: url } }
        } else if (platform === 'fansly') {
            if (!userId) throw new Error('Fansly userId was undefined, but it is required.')
            return { fanslyId: { $eq: userId } }
        }
    })()
    console.log('>>>>> the following is findVtubersFilters.')
    console.log(findVtubersFilters)
    
    const findVtubersQueryString = qs.stringify({
        filters: findVtubersFilters
    }, { encode: false })
    console.log(`>>>>> platform=${platform}, url=${url}, userId=${userId}`)
    
    console.log('>> findVtuber')
    const findVtuberRes = await fetch(`${process.env.STRAPI_URL}/api/vtubers?${findVtubersQueryString}`, {
        method: 'GET',
        headers: {
            'content-type': 'application/json'
        }
    })
    const findVtuberJson = await findVtuberRes.json()
    console.log('>> here is the vtuber json')
    console.log(findVtuberJson)
    if (findVtuberJson?.data && findVtuberJson.data.length > 0) {
        console.log('>>a vtuber was FOUND')
        if (findVtuberJson.data.length > 1) throw new Error('There was more than one vtuber match. There must only be one.')
        vtuberId = findVtuberJson.data[0].id
        console.log('here is the findVtuberJson (as follows)')
        console.log(findVtuberJson)
        console.log(`the matching vtuber has ID=${vtuberId} (${findVtuberJson.data[0].attributes.displayName})`)
    }

    if (!vtuberId) {
        console.log('>> !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! (DEPRECATED FUNCTION) vtuberId was not found so we create')

        /**
         * We are creating a vtuber record.
         * We need a few things.
         *   * image URL
         *   * themeColor
         * 
         * To get an image, we have to do a few things.
         *   * [x] download image from platform
         *   * [x] get themeColor from image
         *   * [x] upload image to b2
         *   * [x] get B2 cdn link to image
         * 
         * To get themeColor, we need the image locally where we can then run 
         */

        // download image from platform
        // vtuber.getImage expects a vtuber object, which we don't have yet, so we create a dummy one
        const dummyVtuber = {
            attributes: {
                slug: fpSlugify(channel),
                fansly: fansly.url.fromUsername(channel)
            }
        }
        const platformImageUrl = await getImage(dummyVtuber)
        const imageFile = await download({ url: platformImageUrl })

        // get themeColor from image
        const themeColor = await getProminentColor(imageFile)

        // upload image to b2
        const b2FileData = await s3.uploadFile(imageFile)

        // get b2 cdn link to image
        const imageCdnLink = `${process.env.CDN_BUCKET_URL}/${b2FileData.Key}`


        const createVtuberRes = await fetch(`${process.env.STRAPI_URL}/api/vtubers`, {
            method: 'POST',
            headers: {
                'authorization': `Bearer ${process.env.SCOUT_STRAPI_API_KEY}`,
                'content-type': 'application/json'
            },
            body: JSON.stringify({
                data: {
                    displayName: channel,
                    fansly: (platform === 'fansly') ? url : null,
                    fanslyId: (platform === 'fansly') ? userId : null,
                    chaturbate: (platform === 'chaturbate') ? url : null,
                    slug: fpSlugify(channel),
                    description1: ' ',
                    image: imageCdnLink,
                    themeColor: themeColor || '#dde1ec'
                }
            })
        })
        const createVtuberJson = await createVtuberRes.json()
        console.log('>> createVtuberJson as follows')
        console.log(JSON.stringify(createVtuberJson, null, 2))
        if (createVtuberJson.data) {
            vtuberId = createVtuberJson.data.id
            console.log(`>>> vtuber created with id=${vtuberId}`)
        }
    }

    if (!vtuberId) throw new Error(`>> we weren't able to find or create a vtuberId so we are panicking. (this should not happen under normal circumstances. Bug desu ka?)`)
    console.log(`>># Step 2. vtuberId=${vtuberId}`)
    // # Step 2.
    // Next we create the platform-notification record.
    // This probably doesn't already exist, so we don't check for a pre-existing platform-notification.
    const pNotifPayload = {
        data: {
            source: source,
            date: date,
            date2: date,
            platform: platform,
            vtuber: vtuberId,
        }
    }
    console.log('pNotifPayload as follows')
    console.log(pNotifPayload)

    const pNotifCreateRes = await fetch(`${process.env.STRAPI_URL}/api/platform-notifications`, {
        method: 'POST',
        headers: {
            'authorization': `Bearer ${process.env.SCOUT_STRAPI_API_KEY}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(pNotifPayload)
    })
    const pNotifData = await pNotifCreateRes.json()
    if (pNotifData.error) {
        console.error('>> we failed to create platform-notification, there was an error in the response')
        console.error(pNotifData.error)
        throw new Error(pNotifData.error)
    }
    console.log(`>> pNotifData (json response) is as follows`)
    console.log(pNotifData)
    if (!pNotifData.data?.id) throw new Error('failed to created pNotifData! The response was missing an id');

    // # Step 3.
    // Finally we find or create the stream record
    // The stream may already be in the db (the streamer is multi-platform streaming), so we look for that record.
    // This gets a bit tricky. How do we determine one stream from another?
    // For now, the rule is 30 minutes of separation. 
    // Anything <=30m is interpreted as the same stream. Anything >30m is interpreted as a different stream.
    // If the stream is not in the db, we create the stream record
    const dateSinceRange = subMinutes(new Date(date), 30)
    const dateUntilRange = addMinutes(new Date(date), 30)
    console.log(`Find a stream within + or - 30 mins of the notif date=${new Date(date).toISOString()}. dateSinceRange=${dateSinceRange.toISOString()}, dateUntilRange=${dateUntilRange.toISOString()}`)
    const findStreamQueryString = qs.stringify({
        populate: 'platform_notifications',
        filters: {
            date: {
                $gte: dateSinceRange,
                $lte: dateUntilRange
            },
            vtuber: {
                id: {
                    '$eq': vtuberId
                }
            }
        }
    }, { encode: false })

    console.log('>> findStream')
    const findStreamRes = await fetch(`${process.env.STRAPI_URL}/api/streams?${findStreamQueryString}`, {
        method: 'GET',
        headers: {
            'authorization': `Bearer ${process.env.SCOUT_STRAPI_API_KEY}`,
            'Content-Type': 'application/json'
        }
    })
    const findStreamData = await findStreamRes.json()
    if (findStreamData?.data && findStreamData.data.length > 0) {
        console.log('>> we found a findStreamData json. (there is an existing stream for this e-mail/notification)')
        console.log(findStreamData)
        streamId = findStreamData.data?.id

        // Before we're done here, we need to do something extra. We need to populate isChaturbateStream and/or isFanslyStream.
        // We know which of these booleans to set based on the stream's related platform_notifications
        // We go through each pNotif and look at it's platform
        let isFanslyStream, isChaturbateStream
        for (const pn of findStreamData.platform_notifications) {
            if (pn.platform === 'fansly') {
                isFanslyStream = true
            } else if (pn.platform === 'chaturbate') {
                isChaturbateStream = true
            }
        }

        console.log(`>>> updating stream ${streamId}. isFanslyStream=${isFanslyStream}, isChaturbateStream=${isChaturbateStream}`)
        const updateStreamRes = await fetch(`${process.env.STRAPI_URL}/api/stream/${streamId}`, {
            method: 'PUT',
            headers: {
                'authorization': `Bearer ${process.env.SCOUT_STRAPI_API_KEY}`,
                'content-type': 'application/json'
            },
            body: JSON.stringify({
                data: {
                  isFanslyStream: isFanslyStream,
                  isChaturbateStream: isChaturbateStream
                }
            })
        })
        const updateStreamJson = await updateStreamRes.json()
        if (updateStreamJson?.error) throw new Error(updateStreamJson);
        console.log(`>> assuming a successful update to the stream record. response as follows.`)
        console.log(JSON.stringify(updateStreamJson, null, 2))
    }

    if (!streamId) {
        console.log('>> did not find a streamId, so we go ahead and create a stream record in the db.')
        const createStreamPayload = {
            data: {
                isFanslyStream: (platform === 'fansly') ? true : false,
                isChaturbateStream: (platform === 'chaturbate') ? true : false,
                archiveStatus: 'missing',
                date: date,
                date2: date,
                date_str: date,
                vtuber: vtuberId,
                platform_notifications: [
                    pNotifData.data.id
                ]
            }
        }
        console.log('>> createStreamPayload as follows')
        console.log(createStreamPayload)
        const createStreamRes = await fetch(`${process.env.STRAPI_URL}/api/streams`, {
            method: 'POST',
            headers: {
                'authorization': `Bearer ${process.env.SCOUT_STRAPI_API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(createStreamPayload)
        })
        const createStreamJson = await createStreamRes.json()
        console.log('>> we got the createStreamJson')
        console.log(createStreamJson)
        if (createStreamJson.error) {
            console.error(JSON.stringify(createStreamJson.error, null, 2))
            throw new Error('Failed to create stream in DB due to an error. (see above)')
        }
    
    }



}



