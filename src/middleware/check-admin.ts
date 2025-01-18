import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { UserType } from "../common/types";

export const checkAdmin = (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({
        message: "Authentication failed",
      });
    }
    const decoded = jwt.verify(token, String(process.env.JWT_SECRET));
    // @ts-ignore
    req.userData = decoded;
    console.info("JWT decoded info => ", decoded);
    if ((decoded as any).role === UserType.ADMIN) {
      next();
    } else {
      res.status(401).json({ message: "Not allowed" });
    }
  } catch (error) {
    return res.status(401).json(error);
  }
};
