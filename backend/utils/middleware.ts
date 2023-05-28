import { Request, Response, NextFunction } from "express";
import { CustomRequest } from "../types";
import { ValidationError, DatabaseError } from "sequelize";
const jwt = require("jsonwebtoken");
import { SECRET } from "./config";
import { User } from "../models";

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

export const tokenExtractor = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const authorisation = req.get("Authorization");
  if (authorisation && authorisation.toLowerCase().startsWith("bearer ")) {
    req.decodedToken = jwt.verify(authorisation.substring(7), SECRET);
  }
  const decodedToken = req.decodedToken;
  const userId =
    typeof decodedToken === "string" ? decodedToken : decodedToken?.id;
  const user = await User.findByPk(userId); // Use the extracted ID to find the user

  if (user instanceof User) {
    req.user = user;
  }

  next();
};
