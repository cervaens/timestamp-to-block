import { ethers } from "ethers";
import { IBlockData, IEstimation, IBlockNumberTimestamp } from "./interfaces";

/**
 * Class declaration for function related with blocks and timestamps
 */
class BlockNumberTimestamp implements IBlockNumberTimestamp {
  private lowestTS = 1438269988;
  private avgBlockFromStart = 15.426;
  private avgBlockFromEnd = 13.375;
  private provider: ethers.providers.AlchemyProvider;

  constructor(provider: ethers.providers.AlchemyProvider) {
    this.provider = provider;
  }

  /**
   * Calculates the closest block number, given a timestamp in secs
   * @param targetTimestamp number
   * @returns Promise<IBlockData>
   */
  public async getBlockNumberPerTS(
    targetTimestamp: number
  ): Promise<IBlockData> {
    let nrBulkCalls = 0;

    // Handling TS lower than first block
    if (targetTimestamp < this.lowestTS) {
      return {
        blockNumber: 1,
        nrBulkCalls: 0,
      };
    }

    const edgeBlocks = await Promise.all([
      this.provider.getBlock(1),
      this.provider.getBlock("latest"),
    ]).catch((err) => {
      console.log(err);
      // We stop here as we need the edge blocks.
      throw new Error("Could not get reference blocks");
    });
    nrBulkCalls += 1;

    // Handling TS lower than first block
    if (targetTimestamp > edgeBlocks[1].timestamp) {
      throw new Error("Date in the future");
    }

    // Initializing config for the first estimation
    // here we decide if the reference block is the first or the last
    const reference: IEstimation = {
      targetTS: targetTimestamp,
      block:
        targetTimestamp - edgeBlocks[0].timestamp >
        edgeBlocks[1].timestamp - targetTimestamp
          ? edgeBlocks[1]
          : edgeBlocks[0],
      avgTime:
        targetTimestamp - edgeBlocks[0].timestamp >
        edgeBlocks[1].timestamp - targetTimestamp
          ? this.avgBlockFromEnd
          : this.avgBlockFromStart,
      errorPct: 2,
      samples: 22,
    };

    // Main loop which will get block samples in each cycle
    // acording to the reference config
    while (nrBulkCalls < 10) {
      const newRefs = await Promise.all(
        this.createEstimationPromises(reference)
      ).catch((err) => {
        // We want to continue so we just log the error
        console.log(err);
      });

      nrBulkCalls += 1;
      if (!newRefs) {
        // Try again
        continue;
      }

      // insideSamples will tell us if the targetTimestamp is inside
      // a newRefs range
      let insideSamples = false;

      // For each newRefs interval we'll identify if targetTimestamp is
      // before or after the current block number
      for (let i = 0; i < newRefs.length; i += 1) {
        // As we always start by newRefs smallest timestamp we check if
        // current block's timestamp is bigger (and not lower) than target
        if (newRefs[i].timestamp > targetTimestamp) {
          // If all samples are higher than target break the cycle
          // and set reference block as the first one
          if (i === 0) {
            break;
          }
          insideSamples = true;

          // We return here the exact block.
          // This only happens when the previous block
          // is the current block minus one
          if (newRefs[i].number - 1 === newRefs[i - 1].number) {
            return {
              blockNumber: newRefs[i].number,
              nrBulkCalls,
            };
          }
          // Here we find the range that includes our targetTimestamp
          // so we defined the new reference block as the beggining
          // of this range for the next cycle and break;
          reference.avgTime =
            (newRefs[i].timestamp - newRefs[i - 1].timestamp) /
            (newRefs[i].number - newRefs[i - 1].number);
          reference.block = newRefs[i - 1];

          break;
        }
        // If by chance timestamp is the exact same one as the block
        // we return the following block
        else if (newRefs[i].timestamp === targetTimestamp) {
          return {
            blockNumber: newRefs[i].number + 1,
            nrBulkCalls,
          };
        }
      }
      // If the estimation missed all ranges
      if (!insideSamples) {
        // All samples higher than target
        if (newRefs[0].timestamp > targetTimestamp) {
          reference.avgTime =
            (newRefs[newRefs.length - 1].timestamp - newRefs[0].timestamp) /
            (newRefs[newRefs.length - 1].number - newRefs[0].number);
          reference.block = newRefs[0];
        }
        // All samples below target
        else {
          reference.avgTime =
            (newRefs[newRefs.length - 1].timestamp -
              newRefs[newRefs.length - 2].timestamp) /
            (newRefs[newRefs.length - 1].number -
              newRefs[newRefs.length - 2].number);
          reference.block = newRefs[newRefs.length - 1];
        }
      }
    }
    throw new Error(`Too long to identify the block number`);
  }

  /**
   * This function creates multiple getBlock promises to try to get a range of
   * blocks where a target block will be included, given the target's block
   * timestamp.
   * To understand which block numbers it needs to call for:
   *  1. it takes a reference (estimated) block,
   *  2. using the time difference to the target block's timestamp, it estimates
   *     the number of blocks diff from the ref block to the target's block,
   *     using an average block build time and moves the ref block to that new one,
   *  3. it creates the number of samples calls around that new ref block
   *     considering a percentage error of "errorPct" after and before the
   *     new reference block.
   * @param param0 IEstimation
   * @returns Array<Promise<ethers.providers.Block>>
   */
  public createEstimationPromises({
    targetTS,
    block,
    avgTime,
    errorPct,
    samples,
  }: IEstimation): Array<Promise<ethers.providers.Block>> {
    const promises = [];

    const moveBlocks = Math.floor((block.timestamp - targetTS) / avgTime);

    let moveBlocksError = Math.floor((Math.abs(moveBlocks) * errorPct) / 100);

    moveBlocksError =
      moveBlocksError < samples / 2 ? samples / 2 : moveBlocksError;
    const newRefBlock = block.number - moveBlocks;
    const toBlock = newRefBlock + moveBlocksError;
    let fromBlock = newRefBlock - moveBlocksError;
    fromBlock = fromBlock < 1 ? 1 : fromBlock;

    const interval =
      Math.abs(Math.floor((Number(toBlock) - fromBlock) / samples)) || 1;

    for (let i = fromBlock; i <= toBlock; i += interval) {
      promises.push(this.provider.getBlock(i));
    }
    return promises;
  }
}
export default BlockNumberTimestamp;
