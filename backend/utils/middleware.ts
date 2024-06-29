import { Request, Response, NextFunction } from "express";
import { CustomRequest } from "../types";
import { ValidationError, DatabaseError } from "sequelize";
const jwt = require("jsonwebtoken");
import { SECRET } from "./config";
import { User } from "../models";
import Blacklistedtoken from "../models/blacklistedtoken";

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
    const token = authorisation.substring(7);
    const blacklistedtoken = await Blacklistedtoken.findOne({
      where: {
        token: token,
      },
    });
    if (blacklistedtoken) {
      return res
        .status(401)
        .send("Token is blacklisted. Try logging in again.");
    }
    req.decodedToken = jwt.verify(token, SECRET);
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
