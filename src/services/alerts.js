import { sendWhatsAppTemplateMessage } from "./whatsapp.js";

const customerConfigs = {
  cust_001: {
    name: "Test Customer",
    recipients: ["+37200000000"],
    templates: {
      ACTIVE: "fault_alert_v1",
      CLEARED: "fault_cleared_v1"
    }
  }
};

export async function processAlert(alert) {
  const { customerId, machineId, faultCode, faultText, state } = alert;

  const customer = customerConfigs[customerId];

  if (!customer) {
    throw new Error(`Unknown customerId: ${customerId}`);
  }

  const templateName = customer.templates[state];
  if (!templateName) {
    throw new Error(`No template configured for state: ${state}`);
  }

  const results = [];

  for (const recipient of customer.recipients) {
    const result = await sendWhatsAppTemplateMessage({
      to: recipient,
      templateName,
      parameters: [machineId, `${faultCode} ${faultText}`, state]
    });

    results.push({
      recipient,
      result
    });
  }

  return {
    ok: true,
    customer: customer.name,
    machineId,
    faultCode,
    state,
    deliveries: results
  };
}