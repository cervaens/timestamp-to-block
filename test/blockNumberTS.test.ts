import { expect, jest } from "@jest/globals";
import { ethers } from "ethers";
import BlockNumberTimestamp from "../src/api/services/blockByDate";

let provider: ethers.providers.AlchemyProvider;
let blockNumberTimestamp: BlockNumberTimestamp;

beforeAll(() => {
  provider = new ethers.providers.AlchemyProvider(
    process.env.NETWORK || "mainnet",
    process.env.ALCHEMY_API_KEY || ""
  );
  blockNumberTimestamp = new BlockNumberTimestamp(provider);
});

describe("Main test", () => {
  jest.setTimeout(7000);

  it("Testing provider getBlockNumber", async () => {
    const result = await provider.getBlock(2565282);
    expect(result.timestamp).toBe(1478269987);
  });

  it.skip("testing TS close to block 1", async () => {
    const result = await blockNumberTimestamp.getBlockNumberPerTS(1438269988);
    expect(result.blockNumber).toBe(2);
  });

  it.skip("testing TS in mid zone", async () => {
    const result = await blockNumberTimestamp.getBlockNumberPerTS(1538269988);
    expect(result.blockNumber).toBe(6424455);
  });

  it.skip("testing another TS in mid zone", async () => {
    const result = await blockNumberTimestamp.getBlockNumberPerTS(1608269988);
    expect(result.blockNumber).toBe(11475292);
  });

  it.skip("testing TS close to now", async () => {
    const now = new Date().getTime();
    const result = await blockNumberTimestamp.getBlockNumberPerTS(
      Math.floor(now / 1000) - 200
    );
    expect(result).toBeDefined;
  });

  it.skip("testing Date in the future", async () => {
    const now = new Date().getTime();
    await blockNumberTimestamp
      .getBlockNumberPerTS(Math.floor(now / 1000))
      .catch((err) => {
        expect(err.message).toBe("Date in the future");
      });
  });
});
