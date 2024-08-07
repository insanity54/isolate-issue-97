import child_process from 'node:child_process'

export interface SpawnOutput {
  code: number;
  output: string;
}


/**
 * we have this child_process.spawn wrapper to make testing easier.
 * this function is meant to be mocked during unit tests so the function logic can be tested
 * without making a network request.
 */
export default async function spawnWrapper (command: string, args: string[]): Promise<SpawnOutput> {
  console.log(`spawnWrapper command=${command}, args=${JSON.stringify(args, null, 2)}`)
  return new Promise((resolve, reject) => {
    let output = '';
    const process = child_process.spawn(command, args)
    process.on('exit', function (code) {
      if (code === undefined || code === null) throw new Error('process exited without an exit code');
      resolve({ code, output })
    })
    process.stdout.on('data', (data) => {
      output += data
    })
    process.stderr.on('data', (data) => {
      output += data
    })
    process.on('error', function (e) {
      reject(e)
    })
  })
}

