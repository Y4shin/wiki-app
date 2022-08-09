import { Request, Response, NextFunction } from "express";
import { user as userF } from "../lib/db";
import jwt from "jsonwebtoken";

const {getUserById} = userF;

export default async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader) {
    return res.status(401).send({ error: "No token provided", code: "auth/no-token" });
  }
  if (authHeader.substring(0, 7) !== "Bearer ") {
    return res.status(401).send({ error: "Invalid token", code: "auth/invalid-token" });
  }

  if (authHeader) {
    const token = authHeader.substring(7);
    if (token === "") {
      return res.status(401).send({ error: "Invalid token", code: "auth/invalid-token" });
    }
    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
      if (err) {
        if (err.name === "TokenExpiredError") {
          return res.status(401).send({ error: "Token expired", code: "auth/token-expired" });
        } else {
          return res.status(401).send({ error: "Invalid token", code: "auth/invalid-token" });
        }
      }
      if (decoded) {
        const user = decoded as {uid: number};
        const dbUser = await getUserById(user.uid);
        if (!dbUser || !dbUser.active) {
          return res.status(401).send({ error: "Invalid token", code: "auth/invalid-token" });
        }
        req.uid = user.uid;
        next();
      } else {
        return res.status(401).send({ error: "Invalid token", code: "auth/invalid-token" });
      }
    })
  }
}