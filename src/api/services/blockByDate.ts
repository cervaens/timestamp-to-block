import { provider } from "../../index";

interface IBlockData {
  blockNumber: number;
  timestamp: number;
  nrBlockchainRequests: number;
}

interface IBlockNumberTimestamp {
  getClosestBlockNumber(targetTimestamp: number): Promise<IBlockData>;
}

class BlockNumberTimestamp implements IBlockNumberTimestamp {
  private lowestTS = 1438269988;

  public async getClosestBlockNumber(
    targetTimestamp: number
  ): Promise<IBlockData> {
    let averageBlockTime = 18;
    let nrBlockchainRequests = 0;

    // Handling TS lower than first block
    if (targetTimestamp < this.lowestTS) {
      const block = await provider.getBlock(1);
      return {
        blockNumber: block.number,
        timestamp: block.timestamp,
        nrBlockchainRequests: 1,
      };
    }

    // get current block number
    let blockNumber = await provider.getBlockNumber();
    let block = await provider.getBlock(blockNumber);

    // 100 cycles max to not keep on looping
    while (nrBlockchainRequests < 100) {
      const refTimestamp = Number(block.timestamp);
      const decreaseBlocks = Math.floor(
        (refTimestamp - targetTimestamp) / averageBlockTime
      );

      // A block timestamp will eventually be inside the avg range
      if (
        Math.abs(targetTimestamp - block.timestamp) < averageBlockTime ||
        averageBlockTime === 0
      ) {
        if (targetTimestamp < block.timestamp) {
          blockNumber -= 1;
          blockNumber = blockNumber < 0 ? 1 : blockNumber;
          const previousBlock = await provider.getBlock(blockNumber);
          nrBlockchainRequests += 1;

          // Last condition here is for when block is 1
          if (
            previousBlock.timestamp <= targetTimestamp ||
            block.number === previousBlock.number
          ) {
            break;
          }
          // Still above targetTimestamp
          block = previousBlock;
        } else if (targetTimestamp >= block.timestamp) {
          blockNumber += 1;
          block = await provider.getBlock(blockNumber);
          nrBlockchainRequests += 1;
          if (block.timestamp > targetTimestamp) {
            break;
          }
        }
      } else {
        // While the block timestamp is far from the target we decrease
        // the block number with an estimate and to get the timestamp
        blockNumber -= decreaseBlocks;
        blockNumber = blockNumber < 0 ? 1 : blockNumber;

        block = await provider.getBlock(blockNumber);
        nrBlockchainRequests += 1;
      }

      // adapting the avg time unless we're really close to the wanted block
      if (decreaseBlocks > 1 || decreaseBlocks < -1) {
        averageBlockTime =
          (refTimestamp - Number(block.timestamp)) / decreaseBlocks;
      }
    }

    return {
      blockNumber: block.number,
      timestamp: block.timestamp,
      nrBlockchainRequests,
    };
  }
}
export default new BlockNumberTimestamp();
