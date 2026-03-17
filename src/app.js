import "dotenv/config";
import express from "express";
import plcRouter from "./routes/plc.js";
import { logger } from "./utils/logger.js";
import { startTcpServer } from "./services/tcp-server.js";
import { processAlert } from "./services/alerts.js";

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

app.get("/test-notification", async (req, res) => {
  if (req.headers["x-api-key"] !== process.env.API_KEY) {
    return res.status(401).json({ ok: false, error: "Unauthorized" });
  }

  try {
    const result = await processAlert({
      customerId: "cust_001",
      machineId: "test_machine",
      faultCode: `TEST_${Date.now()}`,
      faultText: "Manual test notification",
      state: "ACTIVE"
    });

    res.json(result);
  } catch (error) {
    res.status(500).json({
      ok: false,
      error: error.message
    });
  }
});

app.post("/test-notification", async (req, res) => {
  try {
    const result = await processAlert({
      customerId: "cust_001",
      machineId: "test_machine",
      faultCode: `TEST_${Date.now()}`,
      faultText: "Manual test notification",
      state: "ACTIVE"
    });

    res.json(result);
  } catch (error) {
    res.status(500).json({
      ok: false,
      error: error.message
    });
  }
});

startTcpServer(Number(tcpPort));