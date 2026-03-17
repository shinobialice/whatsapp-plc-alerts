import express from "express";
import dotenv from "dotenv";
import plcRouter from "./routes/plc.js";
import { logger } from "./utils/logger.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ ok: true });
});

app.use("/", plcRouter);

app.listen(port, () => {
  logger.info(`Server running on port ${port}`);
});