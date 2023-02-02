import { Request, Response } from "express";
import IBlockNumberTimestamp from "../services/blockByDate";

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
    // Here we dont wait as it might take a long time for an API response
    data = await IBlockNumberTimestamp.getClosestBlockNumber(targetTS);
    res.status(200).json(data); //.send(`Closest block is ${JSON.stringify(data)}`);
  } catch (err) {
    console.log(err);
    res.status(500).send(`Internal error when performing calculations`);
  }
};
