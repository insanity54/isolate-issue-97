'use strict'

/**
 * watches an e-mail inbox for going live notifications
 */

// import { checkEmail } from './parsers.js'
// // import { createStreamInDb } from './signals.js'
// import { Email } from './imap.js'
import { Client, Connection } from '@temporalio/client'
// import { type NotificationData } from '@futurenet/types'
// import { type FetchMessageObject } from 'imapflow'
import { createId } from '@paralleldrive/cuid2'

console.log('connecting to temporal...')
const connection = await Connection.connect({ address: 'temporal-frontend.futurenet.svc.cluster.local:7233' });
const client = new Client({ connection, namespace: 'futurenet' });



// async function handleMessage({ email, msg }: { email: Email, msg: FetchMessageObject }) {
//     try {
//         console.log('    ✏️ loading message')
//         const body = await email.loadMessage(msg.uid)

//         console.log('    ✏️ checking e-mail')
//         const { isMatch, url, platform, channel, displayName, date, userId, avatar }: NotificationData = (await checkEmail(body) ) 

//         if (isMatch) {
//             const wfId = `process-email-${createId()}`
//             // console.log(`    ✏️ [DRY] starting Temporal workflow ${wfId} @todo actually start temporal workflow`)
//             // await signalRealtime({ url, platform, channel, displayName, date, userId, avatar })
//             // @todo invoke a Temporal workflow here
//             console.log('    ✏️✏️ starting Temporal workflow')
//             // const handle = await client.workflow.start(WorkflowA, {
//             //     workflowId: wfId,
//             //     taskQueue: 'futurenet'
//             // });
//             // // const handle = await client.workflow.start(processNotifEmail, {
//             // //     workflowId: wfId,
//             // //     taskQueue: 'futurenet',
//             // //     args: [{ url, platform, channel, displayName, date, userId, avatar }]
//             // // });
//             // // const handle = client.getHandle(workflowId);
//             // const result = await handle.result()
//             // console.log(`result of the workflow is as follows`)
//             // console.log(result)
//         }

//         console.log('    ✏️ archiving e-mail')
//         await email.archiveMessage(msg.uid)

//     } catch (e) {
//         // console.error('error encoutered')
//         console.error(`An error was encountered while handling the following e-mail message.\n${JSON.stringify(msg, null, 2)}\nError as follows.`)
//         console.error(e)
//     }
// }


(async () => {
    // const email = new Email()
    // email.once('message', (msg: FetchMessageObject) => handleMessage({ email, msg }))
    // await email.connect()
    console.log('scout is starting @todo @todo')
    const wfId = `process-email-${createId()}`
    // @todo
    // const handle = await client.workflow.start(WorkflowA, {
    //     workflowId: wfId,
    //     taskQueue: 'futurenet',
    //     args: [ 'CJ_Clippy' ]
    // });
    // const result = await handle.result()
    // console.log(result)
})()


// console.log('init')