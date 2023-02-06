import dotenv from "dotenv";
import app from "./app";
import alchemyProvider from "./alchemy";

const port = process.env.PORT || 3000;
dotenv.config();

app.listen(port, () => {
  console.log(`API Started on http://localhost:${port}`);
});

export const provider = alchemyProvider();
