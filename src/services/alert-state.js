import { db } from "../db/database.js";

function buildAlertKey({ customerId, machineId, faultCode }) {
  return `${customerId}::${machineId}::${faultCode}`;
}

const getAlertStmt = db.prepare(`
  SELECT alert_key, status
  FROM alert_state
  WHERE alert_key = ?
`);

const upsertAlertStmt = db.prepare(`
  INSERT INTO alert_state (
    alert_key,
    customer_id,
    machine_id,
    fault_code,
    fault_text,
    status,
    updated_at
  ) VALUES (?, ?, ?, ?, ?, ?, ?)
  ON CONFLICT(alert_key) DO UPDATE SET
    fault_text = excluded.fault_text,
    status = excluded.status,
    updated_at = excluded.updated_at
`);

export async function shouldSendAlert(alert) {
  const key = buildAlertKey(alert);
  const existing = getAlertStmt.get(key);

  if (alert.state === "ACTIVE") {
    if (existing?.status === "ACTIVE") {
      return {
        shouldSend: false,
        reason: "Alert already active"
      };
    }

    upsertAlertStmt.run(
      key,
      alert.customerId,
      alert.machineId,
      alert.faultCode,
      alert.faultText,
      "ACTIVE",
      new Date().toISOString()
    );

    return { shouldSend: true };
  }

  if (alert.state === "CLEARED") {
    if (!existing || existing.status !== "ACTIVE") {
      return {
        shouldSend: false,
        reason: "Alert was not active"
      };
    }

    upsertAlertStmt.run(
      key,
      alert.customerId,
      alert.machineId,
      alert.faultCode,
      alert.faultText,
      "CLEARED",
      new Date().toISOString()
    );

    return { shouldSend: true };
  }

  return {
    shouldSend: false,
    reason: "Unknown state"
  };
}