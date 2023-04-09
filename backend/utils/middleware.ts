import { Request, Response, NextFunction } from "express";
import { ValidationError, DatabaseError } from "sequelize";

export const errorHandler = (
  error: any,
  req: Request,
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
