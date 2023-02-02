import { ethers } from "ethers";
import dotenv from "dotenv";
import app from "./app";

const port = process.env.PORT || 3000;
dotenv.config();

app.listen(port, () => {
  console.log(`API Started on http://localhost:${port}`);
});

export const provider = new ethers.providers.JsonRpcProvider(
  process.env.ALCHEMY_HTTP_URL || ""
);
