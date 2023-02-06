import { ethers } from "ethers";
export interface IBlockData {
  blockNumber: number;
  nrBulkCalls: number;
}

export interface IEstimation {
  targetTS: number;
  block: ethers.providers.Block;
  avgTime: number;
  errorPct: number;
  samples: number;
}

export interface IBlockNumberTimestamp {
  getBlockNumberPerTS(targetTimestamp: number): Promise<IBlockData>;
  createEstimationPromises(
    reference: IEstimation
  ): Array<Promise<ethers.providers.Block>>;
}
