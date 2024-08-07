# isolate-issue-97

reproduction repository

@see https://github.com/0x80/isolate-package/issues/97

## steps to reproduce

    cd ./packages/scout; pnpn i; pnpm build; npx isolate-package isolate

error as follows

```
error Failed to generate lockfile: Cannot read properties of undefined (reading 'specifiers')
TypeError: Cannot read properties of undefined (reading 'specifiers')
    at pruneLockfile (/home/cj/.npm/_npx/27834e9986fbcd8f/node_modules/pnpm_prune_lockfile_v9/src/index.ts:56:56)
    at generatePnpmLockfile (file:///home/cj/.npm/_npx/27834e9986fbcd8f/node_modules/isolate-package/src/lib/lockfile/helpers/generate-pnpm-lockfile.ts:145:15)
    at processLockfile (file:///home/cj/.npm/_npx/27834e9986fbcd8f/node_modules/isolate-package/src/lib/lockfile/process-lockfile.ts:69:7)
    at isolate (file:///home/cj/.npm/_npx/27834e9986fbcd8f/node_modules/isolate-package/src/isolate.ts:175:29)
    at run (file:///home/cj/.npm/_npx/27834e9986fbcd8f/node_modules/isolate-package/src/isolate-bin.ts:9:3)
```