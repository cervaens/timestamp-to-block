# timestamp-to-block

Given a timestamp in seconds, it returns the closest ethereum block number that was created right after the timestamp.

## How it works

> The algorithm starts by assuming average block build times, depending if the timestamp is closer to block 1 timestamp or latest block timestamp.
>
> So using one of the edge blocks as the reference block (RB), it estimates how many blocks it will have to move from that RB to reach closer to the wanted block (WB), that will define an estimated block (EB).
>
> The algorithm will start a loop where it make getBlock calls to that EB but also to the blocks surrounding it, after and before, as we'll assume an error percentage of moving blocks.
> The block range for this calls will be from "EB - error" to "EB + error" and the polled blocks will have a same interval inside this range between them, the nr calls is fixed to 24.
>
> After having 24 blocks polled it will see if the targetTimestamp is inside any of this ranges, if so it will use the lower block in this range as the next RB and repeat the above in the next cycle of the loop. When targetTimestamp is not inside any range we'll move the RB to the lower/higher block of the main range (depending if targetTimestamp is closer to the higher or lower) and repeat again.
>
> Along this loop cycles the avg build time will also be updated considering the left and right ranges.
> Eventually it will come to a situation where the targetTimestamp is in a such small range that it will manage to call one block after the other and discover what's the WB.

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

You can user swagger UI to use the app in "http://localhost:3000/api-docs/"
The API provides one endpoint in "http://localhost:3000/block-stats" where a timestamp needs to be provided in the epoch format.
Example: "http://localhost:3000/block-stats?timestamp=1643726519"

## Lint

```bash
npm run lint
```
