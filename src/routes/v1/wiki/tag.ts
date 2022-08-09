import { Router, Request, Response } from "express";
import { tag } from "../../../lib/db";
import logMW from "../../../middleware/log";
import auth from "../../../middleware/auth";

const { getTags, getTagById, createNewTag, renameTag, getTagsBySearchTerm } =
  tag;

const router = Router();

/**
 * @swagger
 * /v1/wiki/tag:
 *   get:
 *     summary: Get all tags.
 *     parameters:
 *      - in: query
 *        name: search
 *        schema:
 *          type: string
 *        description: Search Term to filter the tag names by.
 *        required: false
 *     responses:
 *       200:
 *         description: A list of tags.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 tags:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Tag'
 */
router.get("/", [logMW], async (req: Request, res: Response) => {
  try {
    let tags;
    if (
      req.query.search &&
      typeof req.query.search === "string" &&
      req.query.search.length > 0
    ) {
      tags = await getTagsBySearchTerm(req.query.search);
    } else {
      tags = await getTags();
    }
    return res.json({
      tags: tags.map((tag) => {
        return {
          id: tag.id,
          name: tag.name,
        };
      }),
    });
  } catch (error) {
    console.log(JSON.stringify(error))
    req.newLog!("error", "Error getting tags");
    return res
      .status(500)
      .send({ error: "Error getting tags", code: "server/internal" });
  }
});

/**
 * @swagger
 * /v1/wiki/tag/{id}:
 *   get:
 *     summary: Get a tag by id.
 *     parameters:
 *      - in: path
 *        name: id
 *        description: The tag's id.
 *        schema:
 *          type: string
 *        required: true
 *     responses:
 *       200:
 *         description: The tag.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Tag'
 *       404:
 *         description: The tag was not found.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ObjectNotFound'
 */
router.get("/:id", [logMW], async (req: Request, res: Response) => {
  try {
    const tag = await getTagById(req.params.id);
    if (!tag) {
      return res
        .status(404)
        .send({ error: "Tag not found", code: "object/not-found" });
    }
    return res.json({
      tag: {
        id: tag.id,
        name: tag.name,
      },
    });
  } catch (error) {
    req.newLog!("error", "Error getting tag");
    return res
      .status(500)
      .send({ error: "Error getting tag", code: "server/internal" });
  }
});

/**
 * @swagger
 * /v1/wiki/tag:
 *   post:
 *     summary: Create a new tag. (Requires authorization)
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               tag:
 *                 $ref: '#/components/schemas/Tag'
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: The tag.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Tag'
 *       400:
 *         description: The tag was not created.
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                 - $ref: '#/components/schemas/BodyMissingRootObject'
 *                 - $ref: '#/components/schemas/BodyInvalidObject'
 */
router.post("/", [auth, logMW], async (req: Request, res: Response) => {
  try {
    if (!req.body.tag) {
      return res.status(400).send({
        error: "No tag provided",
        code: "invalid-body/missing-root-object",
      });
    }
    if (!req.body.tag.name || !req.body.tag.id) {
      return res.status(400).send({
        error: "Tag needs name and id.",
        code: "invalid-body/invalid-object",
      });
    }
    if (
      typeof req.body.tag.name !== "string" ||
      typeof req.body.tag.id !== "string"
    ) {
      return res.status(400).send({
        error: "Name and id need to be strings.",
        code: "invalid-body/invalid-object",
      });
    }
    const tag = await createNewTag(req.body.tag.name, req.body.tag.id);
    return res.json({
      tag: {
        id: tag.id,
        name: tag.name,
      },
    });
  } catch (error) {
    req.newLog!("error", "Error creating tag");
    return res
      .status(500)
      .send({ error: "Error creating tag", code: "server/internal" });
  }
});

/**
 * @swagger
 * /v1/wiki/tag/{id}:
 *   put:
 *     summary: Rename a tag.
 *     parameters:
 *     - in: path
 *       name: id
 *       description: The tag's id.
 *       schema:
 *         type: string
 *       required: true
 *       example: "vendor"
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The new name of the tag.
 *                 example: "Vendor"
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: The tag.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Tag'
 *       400:
 *         description: The tag was not renamed.
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                 - $ref: '#/components/schemas/BodyMissingRootObject'
 *                 - $ref: '#/components/schemas/BodyInvalidObject'
 *       404:
 *         description: The tag was not found.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ObjectNotFound'
 */
router.put("/:id", [auth, logMW], async (req: Request, res: Response) => {
  try {
    if (!req.body.name) {
      return res.status(400).send({
        error: "No name provided",
        code: "invalid-body/missing-root-object",
      });
    }
    if (typeof req.body.name !== "string") {
      return res.status(400).send({
        error: "Name needs to be a string.",
        code: "invalid-body/invalid-object",
      });
    }
    const tag = await renameTag(req.params.id, req.body.name);
    return res.json({
      tag: {
        id: tag.id,
        name: tag.name,
      },
    });
  } catch (error: any) {
    if (error.code === "P2025") {
      return res
        .status(404)
        .send({ error: "Tag not found", code: "object/not-found" });
    } else {
      req.newLog!("error", "Error renaming tag: " + JSON.stringify(error));
      return res
        .status(500)
        .send({ error: "Error renaming tag", code: "server/internal" });
    }
  }
});

/**
 * @swagger
 * /v1/wiki/tag/{id}:
 *   delete:
 *     summary: Delete a tag.
 *     parameters:
 *       - in: path
 *         name: id
 *         description: The tag's id.
 *         schema:
 *           type: string
 *         required: true
 *         example: "vendor"
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: The tag.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   description: The message.
 *                   example: "Tag deleted"
 *       404:
 *         description: The tag was not found.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ObjectNotFound'
 */
router.delete("/:id", [auth, logMW], async (req: Request, res: Response) => {
  try {
    return res.status(405).json({
      error: "Method not allowed, not implemented yet.",
      code: "api/method-not-allowed",
    });
  } catch (error) {
    req.newLog!("error", `Error deleting tag: ${req.params.id}`);
    return res
      .status(500)
      .send({ error: "Error deleting tag", code: "server/internal" });
  }
});

export default router;
