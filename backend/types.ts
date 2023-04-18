import { Request } from "express";
import { JwtPayload } from "jsonwebtoken";
import { Identifier } from "sequelize";

export interface CustomRequest extends Request {
  decodedToken?: string | JwtPayload;
}

export interface File {
  fileName: string;
  fileLink: string;
  id: number;
}

export interface Section {
  title: string;
  files: File[];
  id: number;
}

export interface ChapterType {
  title: string;
  sections: Section[];
  id: number;
}

export interface CourseType {
  title: string;
  id: number;
  description?: string;
  chapters: ChapterType[];
  students?: string;
}
