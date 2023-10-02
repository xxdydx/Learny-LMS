import dotenv from "dotenv";
dotenv.config();

export const DATABASE_URL: string = process.env.DATABASE_URL as string;
export const PORT = process.env.PORT || 3001;
export const SECRET = process.env.JWT_SECRET;
