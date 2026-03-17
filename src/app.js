import "dotenv/config";
import express from "express";
import plcRouter from "./routes/plc.js";
import { logger } from "./utils/logger.js";
import { startTcpServer } from "./services/tcp-server.js";

const app = express();
const httpPort = process.env.PORT || 3000;
const tcpPort = process.env.TCP_PORT || 4000;

app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ ok: true });
});

app.use("/", plcRouter);

app.listen(httpPort, () => {
  logger.info(`HTTP server running on port ${httpPort}`);
});

startTcpServer(Number(tcpPort));