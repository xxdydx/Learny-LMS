import express from "express";
import { connectToDatabase } from "./utils/db";

const app = express();
app.use(express.json());

const PORT = 3001;

app.get("/ping", (req, res) => {
  console.log("ping");
  res.send("pong");
});

app.listen(PORT, async () => {
  await connectToDatabase();
  console.log(`Server running on port ${PORT}`);
});
