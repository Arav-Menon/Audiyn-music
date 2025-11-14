import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import "dotenv/config";
process.env.AUTH_TOKEN;

export function middleware(req: Request, res: Response, next: NextFunction) {
  try {
    const token = req.headers["authorization"];

    if (!token) {
      return res.status(401).json({ error: "No token, authorization denied" });
    }

    const decoded = jwt.verify(token, process.env.AUTH_TOKEN!) as {
      id: string;
      email: string;
    };

    req.id = decoded.id;
    next();
  } catch (err) {
    console.log(err);
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}
