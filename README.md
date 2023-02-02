# timestamp-to-block

Given a timestamp in seconds, it returns the closest ethereum block number that was created right after the timestamp.

## How it works

> The algorithm starts by assuming an average block build time of 18secs.
> Using the given target timestamp and the latest block's timestamp, it estimates how many blocks it has to go back (EB: estimated block) and reach closer to the block we want to discover (WB: wanted block).
> After this calculation we'll have real data from two distant blocks with their respective timestamps so the avg block build time will be adjusted to a more realistic value (it doesnt mean that the past blocks will have the same block build time, but its a better approximation than the previous).
>
> This will be done in a loop where the EB can pass the WB, so for the next cycle the estimation will increase the EB as its now lower than the WB.
> Eventually the EB timestamp will be near to the WB timestamp within the avg block build time value and when that happens it will go back and/or forth one single block till it gets into a situation where the previous/next timestamp is lower/higher than the target timestamp.

## Pre-Requisites

An account in alchemy.com to connect to an Ethereum node.

## Install

```bash
npm install
```

## Run

Create a .env file based on .env.example and replace xyz by real values

```bash
npm run start
```

The API provides one endpoint in "http://localhost:3000/block-stats" where a timestamp needs to be provided in the epoch format.
Example: "http://localhost:3000/block-stats?timestamp=1643726519"

## Lint

```bash
npm run lint
```
