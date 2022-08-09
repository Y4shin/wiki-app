import { Router, Request, Response } from "express";
import { user } from "../lib/db";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import auth from "../middleware/auth";

const { getUserByEmail, createNewUser } = user;

const router = Router();

/**
 * @swagger
 * /auth/login:
 *   post:
 *     description: Login user
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: The user's email.
 *                 example: "john@doe.com"
 *               password:
 *                 type: string
 *                 description: The user's password.
 *                 example: "password"
 *     responses:
 *       200:
 *         description: The login Token.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: The login Token.
 *       400:
 *         description: Login Body not complete.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MissingCredentials'
 *       401:
 *         description: "The users email or password is incorrect."
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginFailed'
 */
router.post("/login", async (req, res) => {
  try {
    if (!req.body.email || !req.body.password) {
      return res.status(400).send({
        error: "Email and password are required",
        code: "auth/missing-credentials",
      });
    }
    const { email, password } = req.body;
    const user = await getUserByEmail(email);
    if (!user) {
      return res.status(401).send({
        error: "Email or password incorrect",
        code: "auth/invalid-credentials",
      });
    }
    if (await bcrypt.compare(password, user.password)) {
      const jwtPayload = {
        uid: user.uid,
      };
      const token = await jwt.sign(jwtPayload, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || "1d",
      });
      return res.json({ token });
    } else {
      return res.status(401).send({
        error: "Email or password incorrect",
        code: "auth/invalid-credentials",
      });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send({ error: "Error logging in", code: "server/internal" });
  }
});

/**
 * @swagger
 * /auth/register:
 *   post:
 *     description: Register user
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: The user's email.
 *                 example: "john@doe.com"
 *               password:
 *                 type: string
 *                 description: The user's password.
 *                 example: "password"
 *               name:
 *                 type: string
 *                 description: The user's name.
 *                 example: "John Doe"
 *     responses:
 *       200:
 *         description: The token.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: The token.
 *                   example: "qwerty"
 *       400:
 *         description: Register Body not complete.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MissingCredentials'
 *
 */
router.post("/register", async (req, res) => {
  try {
    if (!req.body.email || !req.body.password || !req.body.name) {
      return res.status(400).send({
        error: "Email, password and name are required",
        code: "auth/missing-credentials",
      });
    }
    const { email, password, name } = req.body;
    const user = await createNewUser(
      email,
      await bcrypt.hash(password, await bcrypt.genSalt(10)),
      name
    );
    if (!user) {
      return res
        .status(500)
        .send({ error: "Error creating user", code: "server/internal" });
    }
    const jwtPayload = {
      uid: user.uid,
    };
    const token = await jwt.sign(jwtPayload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || "1d",
    });
    return res.json({ token });
  } catch (error: any) {
    console.log(JSON.stringify(error));
    if (error.code === "P2002") {
      const target: string[] = error.meta.target;
      if (target.includes("email")) {
        return res
          .status(400)
          .send({ error: "Email already exists", code: "auth/email-exists" });
      } else if (target.includes("name")) {
        return res
          .status(400)
          .send({ error: "Name already exists", code: "auth/name-exists" });
      }
    }
    return res
      .status(500)
      .send({ error: "Error creating user", code: "server/internal" });
  }
});

/**
 * @swagger
 * /auth/refresh:
 *   get:
 *     description: Refresh token
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: The token.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: The token.
 *                   example: "qwerty"
 */
router.get("/refresh", [auth], async (req: Request, res: Response) => {
  try {
    const jwtPayload = {
      uid: req.uid,
    };
    const token = await jwt.sign(jwtPayload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || "1d",
    });
    return res.json({ token });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send({ error: "Error refreshing token", code: "server/internal" });
  }
});

export default router;
