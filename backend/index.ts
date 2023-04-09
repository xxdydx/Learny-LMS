import express from "express";
import { connectToDatabase } from "./utils/db";
import usersRouter from "./controllers/users";
import coursesRouter from "./controllers/courses";
import loginRouter from "./controllers/login";
import { PORT } from "./utils/config";
const { errorHandler } = require("./utils/middleware");

const app = express();
app.use(express.json());

app.use("/api/courses", coursesRouter);
app.use("/api/users", usersRouter);
app.use("/api/login", loginRouter);
app.use(errorHandler);

app.listen(PORT, async () => {
  await connectToDatabase();
  console.log(`Server running on port ${PORT}`);
});
