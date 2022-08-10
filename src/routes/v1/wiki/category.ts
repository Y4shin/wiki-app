import {Request, Response, Router} from "express";
import {category} from "../../../lib/db";
import logMW from "../../../middleware/log";
import auth from "../../../middleware/auth";

const {createNewCategory, getCategories, getCategoryById, editCategory} = category;

const router = Router();

/**
 * @swagger
 * /v1/wiki/category:
 *   get:
 *     summary: Get all categories (optionally matching a search term).
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search Term to filter the category names by.
 *         required: false
 *     responses:
 *       200:
 *         description: A list of categories.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 categories:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Category'
 */
router.get("/", async (req, res) => {
  try {
    let categories;
    if (req.query.search && typeof req.query.search === "string" && req.query.search.length > 0) {
      categories = await getCategories(req.query.search);
    } else {
      categories = await getCategories();
    }
    return res.json({
      categories: categories.map((category) => {
        return {
          id: category.id,
          name: category.name,
          description: category.description,
        };
      }),
    });
  } catch (error) {
    console.log(JSON.stringify(error));
    return res.status(500).send({error: "Error getting tags", code: "server/internal"});
  }
});

/**
 * @swagger
 * /v1/wiki/category/{id}:
 *   get:
 *     summary: Get a category by id.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         description: The id of the category to get.
 *         required: true
 *         default: "npc"
 *     responses:
 *       200:
 *         description: A category.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
 *       404:
 *         description: The category was not found.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ObjectNotFound'
 */
router.get("/:id", async (req, res) => {
  try {
    const category = await getCategoryById(req.params.id);
    if (!category) {
      return res.status(404).send({
        error: "Category not found",
        code: "object/not-found",
      });
    }
    return res.json({
      category: {
        id: category.id,
        name: category.name,
        description: category.description,
      },
    });
  } catch (error) {
    console.log(JSON.stringify(error));
    return res.status(500).send({error: "Error getting tags", code: "server/internal"});
  }
});

/**
 * @swagger
 * /v1/wiki/category:
 *   post:
 *     summary: Create a new category.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               category:
 *                 $ref: '#/components/schemas/Category'
 *     responses:
 *       200:
 *         description: The category.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
 *       400:
 *         description: The category was not created.
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                 - $ref: '#/components/schemas/BodyMissingRootObject'
 *                 - $ref: '#/components/schemas/BodyInvalidObject'
 *
 */
router.post("/", [logMW, auth], async (req: Request, res: Response) => {
  try {
    if (!req.body.category) {
      return res.status(400).json({
        error: "Category is required",
        code: "body/missing-root-object",
      });
    }
    if (!req.body.category.name || !req.body.category.id) {
      return res.status(400).json({
        error: "Category needs name and id.",
        code: "body/invalid-object",
      });
    }
    const category = await createNewCategory(
      req.body.category.name,
      req.body.category.id,
      req.body.category.description,
    );
    return res.json({
      category: {
        id: category.id,
        name: category.name,
        description: category.description,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: "Error creating category.",
      code: "server/internal",
    });
  }
});

/**
 * @swagger
 * /v1/wiki/category/{id}:
 *   put:
 *     summary: Edit a category.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         description: The id of the category to edit.
 *         required: true
 *         default: "npc"
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The new name of the category.
 *                 example: "NPC"
 *                 required: false
 *               description:
 *                 type: string
 *                 description: The new description of the category.
 *                 example: "NPCs are the main protagonists in the game."
 *                 required: false
 *     responses:
 *       200:
 *         description: The category.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
 *       400:
 *         description: The category was not edited.
 *         content:
 *           application/json:
 *             schema:
 *               - $ref: '#/components/schemas/BodyMissingRootObject'
 *       404:
 *         description: The category was not found.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ObjectNotFound'
 */
router.put("/:id", [logMW, auth], async (req: Request, res: Response) => {
  try {
    if (!(req.body.name || req.body.description)) {
      return res.status(400).json({
        error: "Either name and description is required.",
        code: "body/missing-root-object",
      });
    }
    const category = await editCategory(req.params.id, req.body.name, req.body.description);
    req!.newLog("info", `Edited category ${category.id}`);
    return res.json({
      category: {
        id: category.id,
        name: category.name,
        description: category.description,
      },
    });
  } catch (error: any) {
    if (error.code === "P2025") {
      return res.status(404).send({error: "Category not found", code: "object/not-found"});
    } else {
      req.newLog!("error", "Error editing category");
      res.status(500).json({
        error: "Error creating category.",
        code: "server/internal",
      });
    }
  }
});

/**
 * @swagger
 * /v1/wiki/category/{id}:
 *   delete:
 *     summary: Delete a category.
 *   security:
 *     - bearerAuth: []
 *   parameters:
 *     - in: path
 *       name: id
 *       schema:
 *         type: string
 *       description: The id of the category to delete.
 *       required: true
 *       default: "npc"
 *   responses:
 *     200:
 *       description: A Success Message.
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               msg:
 *                 type: string
 *                 description: A success message.
 *                 example: "Category deleted."
 *     404:
 *       description: The category was not found.
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ObjectNotFound'
 */
router.delete("/:id", [logMW, auth], async (req: Request, res: Response) => {
  try {
    return res.status(405).json({
      error: "Not implemented",
      code: "method/not-implemented",
    });
  } catch (error: any) {
    if (error.code === "P2025") {
      return res.status(404).send({error: "Category not found", code: "object/not-found"});
    } else {
      req.newLog!("error", "Error deleting category");
      res.status(500).json({
        error: "Error creating category.",
        code: "server/internal",
      });
    }
  }
});

export default router;
