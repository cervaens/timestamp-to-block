import { Request, Response } from "express";
import { provider } from "../../index";
import BlockNumberTimestamp from "../services/blockByDate";

/**
 * Express function that gets logs from a range of blocks
 * @param {*} req
 * @param {*} res
 * @returns
 */
export const getBlockStats = async (req: Request, res: Response) => {
  if (!req.query.timestamp) {
    res.status(400).send(`Please define a timestamp`);
    return;
  }
  const now = new Date().getTime();
  const targetTS = Number(req.query.timestamp);

  if (targetTS * 1000 > now) {
    res.status(400).send(`Timestamps in the future are not allowed.`);
    return;
  }
  let data;

  try {
    const blockNumberTimestamp = new BlockNumberTimestamp(provider);

    data = await blockNumberTimestamp.getBlockNumberPerTS(targetTS);
    res.status(200).json(data);
  } catch (err: unknown) {
    let message = `Internal error: `;
    console.log(err);

    if (err instanceof Error) {
      message += `${err.message}`;
    } else {
      message += `Unexpected error`;
    }
    res.status(500).send(message);
  }
};
