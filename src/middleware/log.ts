import { Request, Response, NextFunction } from "express";
import { log as logF } from "../lib/db";

const { createNewLog, addEntryToLog, finalizeLog } = logF;

export default async (req: Request, res: Response, next: NextFunction) => {
  try {
    const log = await createNewLog(req.originalUrl, 200, req.uid);
    req.newLog = async (
      level: "info" | "warning" | "error",
      message: string
    ) => {
      await addEntryToLog(log.lid, level, message);
    };
    res.on("finish", async () => {
      await finalizeLog(log.lid, res.statusCode);
    });
    next();
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send({ error: "Error creating log", code: "server/internal" });
  }
};
