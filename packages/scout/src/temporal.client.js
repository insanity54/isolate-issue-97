import { Client, Connection } from '@temporalio/client';

import { example } from './temporal.workflow.js';
import { createId } from '@paralleldrive/cuid2';

async function run() {
    // const cert = await fs.readFile('./path-to/your.pem');
    // const key = await fs.readFile('./path-to/your.key');

    let connectionOptions = {
        address: 'temporal-frontend.futurenet.svc.cluster.local',
    };

    const connection = await Connection.connect(connectionOptions);

    const client = new Client({
        connection,
        namespace: 'futurenet',
    });

    console.log('>>> WE ARE RUNNING THE WORKFLOW!!!!')

    const handle = await client.workflow.start(example, {
        taskQueue: 'hello-world',
        // type inference works! args: [name: string]
        args: ['Temporal'],
        // in practice, use a meaningful business ID, like customerId or transactionId
        workflowId: 'workflow-' + createId(),
    });
    console.log(`Started workflow ${handle.workflowId}`);
    
    // optional: wait for client result
    console.log(await handle.result()); // Hello, Temporal!

    await client.connection.close();

}

run().catch((err) => {
    console.error(err);
    process.exit(1);
});