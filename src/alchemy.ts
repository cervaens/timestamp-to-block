import { ethers } from "ethers";

export default () =>
  new ethers.providers.AlchemyProvider(
    process.env.NETWORK || "mainnet",
    process.env.ALCHEMY_API_KEY || ""
  );
