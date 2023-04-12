import { Request, Response, NextFunction } from "express";
import { CustomRequest } from "../types";
import { ValidationError, DatabaseError } from "sequelize";
import jwt from "jsonwebtoken";
import { SECRET } from "./config";

export const errorHandler = (
  error: any,
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  if (error instanceof ValidationError) {
    return res.status(400).send({
      error: error.errors.map((e: any) => e.message),
    });
  }

  if (error instanceof DatabaseError) {
    console.log(error);
    return res.status(400).send({
      error: "bad data...",
    });
  }

  next(error);
};

export const tokenExtractor = (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const authorisation = req.get("Authorization");
  if (authorisation && authorisation.toLowerCase().startsWith("bearer ")) {
    req.decodedToken = jwt.verify(authorisation.substring(7), SECRET);
  }
  next();
};
