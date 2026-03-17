export function parseTcpAlarmMessage(message) {
  const trimmed = message.trim();

  if (!trimmed) {
    throw new Error("Empty TCP message");
  }

  const parts = trimmed.split("|");

  if (parts.length !== 6) {
    throw new Error(
      "Invalid TCP message format. Expected: ALARM|customerId|machineId|faultCode|faultText|state"
    );
  }

  const [messageType, customerId, machineId, faultCode, faultText, state] = parts;

  if (messageType !== "ALARM") {
    throw new Error("Unsupported message type");
  }

  if (!["ACTIVE", "CLEARED"].includes(state)) {
    throw new Error("Invalid state. Must be ACTIVE or CLEARED");
  }

  return {
    customerId,
    machineId,
    faultCode,
    faultText,
    state
  };
}