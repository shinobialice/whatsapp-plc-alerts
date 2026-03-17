import { sendWhatsAppTemplateMessage } from "./whatsapp.js";
import { getCustomerById } from "./customer-config.js";
import { shouldSendAlert } from "./alert-state.js";

export async function processAlert(alert) {
  const { customerId, machineId, faultCode, faultText, state } = alert;

  const customer = await getCustomerById(customerId);

  if (!customer) {
    throw new Error(`Unknown customerId: ${customerId}`);
  }

  const dedupeResult = await shouldSendAlert(alert);

  if (!dedupeResult.shouldSend) {
    return {
      ok: true,
      skipped: true,
      reason: dedupeResult.reason,
      customer: customer.name,
      machineId,
      faultCode,
      state
    };
  }

  const templateName = customer.templates[state];

  if (!templateName) {
    throw new Error(`No template configured for state: ${state}`);
  }

  const deliveries = [];

  for (const recipient of customer.recipients) {
    const result = await sendWhatsAppTemplateMessage({
      to: recipient,
      templateName,
      parameters: [machineId, `${faultCode} ${faultText}`, state]
    });

    deliveries.push({
      recipient,
      result
    });
  }

  return {
    ok: true,
    skipped: false,
    customer: customer.name,
    machineId,
    faultCode,
    state,
    deliveries
  };
}