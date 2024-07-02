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
  try {
    const authorization = req.get("Authorization");
    if (authorization && authorization.toLowerCase().startsWith("bearer ")) {
      const token = authorization.substring(7);

      // Check if the token is blacklisted
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

      // Verify the token
      req.decodedToken = jwt.verify(token, SECRET);
    }

    // Extract user ID from decoded token
    const decodedToken = req.decodedToken;
    const userId =
      typeof decodedToken === "string" ? decodedToken : decodedToken?.id;

    // Find the user by ID
    const user = await User.findByPk(userId);
    if (user instanceof User) {
      req.user = user;
    } else {
      return res.status(404).send("User not found");
    }

    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(400).send("Invalid token");
    } else if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).send("Token expired");
    } else {
      return res.status(500).send("Internal server error");
    }
  }
};
