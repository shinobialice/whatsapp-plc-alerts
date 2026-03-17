import { logger } from "../utils/logger.js";

export async function sendWhatsAppTemplateMessage({
  to,
  templateName,
  parameters
}) {
  logger.info(
    {
      to,
      templateName,
      parameters
    },
    "Mock WhatsApp send"
  );

  return {
    success: true,
    provider: "mock",
    messageId: `mock-${Date.now()}`
  };
}