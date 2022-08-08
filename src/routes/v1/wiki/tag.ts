import { Router, Request, Response } from "express";
import { tag } from "../../../lib/db";
import logMW from "../../../middleware/log";

const { getTags } = tag;

const router = Router();

router.get("/", [logMW], async (req: Request, res: Response) => {
  try {
    const tags = await getTags();
    res.json(
      tags.map((tag) => {
        return {
          id: tag.id,
          name: tag.name,
        };
      })
    );
  } catch (error) {
    req.newLog!("error", "Error getting tags");
    res.status(500).send({ error: "Error getting tags", code: "server/internal" });
  }
  res.send("test");
});

export default router;
