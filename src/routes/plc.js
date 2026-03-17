import express from "express";
import { processAlert } from "../services/alerts.js";

const router = express.Router();

router.post("/plc-alert", async (req, res) => {
  if (req.headers["x-api-key"] !== process.env.API_KEY) {
    return res.status(401).json({
      ok: false,
      error: "Unauthorized"
    });
  }

  try {
    const { customerId, machineId, faultCode, faultText, state } = req.body;
    if (!customerId || !machineId || !faultCode || !faultText || !state) {
      return res.status(400).json({
        ok: false,
        error: "Missing required fields"
      });
    }

    if (!["ACTIVE", "CLEARED"].includes(state)) {
      return res.status(400).json({
        ok: false,
        error: "state must be ACTIVE or CLEARED"
      });
    }

    const result = await processAlert({
      customerId,
      machineId,
      faultCode,
      faultText,
      state
    });

    return res.json(result);
  } catch (error) {
    return res.status(500).json({
      ok: false,
      error: error.message
    });
  }
});

export default router;