import dotenv from "dotenv";
dotenv.config();

export const DATABASE_URL: string = process.env.DATABASE_URL as string;
export const PORT = process.env.PORT || 3001;
export const SECRET = `56.R>_~.RX'U/X;yGbxZmYDpe@w7J9YRz2qy$/4b4;\v5-?a&Nj7zeH55AjA`;
