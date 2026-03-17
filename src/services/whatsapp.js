import twilio from "twilio";
import { logger } from "../utils/logger.js";

export async function sendWhatsAppTemplateMessage({
  to,
  templateName,
  parameters
}) {
  const client = twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
  );

  const message = await client.messages.create({
    from: process.env.TWILIO_WHATSAPP_FROM,
    to: `whatsapp:${to.replace(/^whatsapp:/, "")}`,
    contentSid: process.env.TWILIO_CONTENT_SID,
    contentVariables: JSON.stringify({
      "1": parameters[0],
      "2": parameters[1],
      "3": parameters[2]
    })
  });

  logger.info(
    {
      sid: message.sid,
      to,
      from: process.env.TWILIO_WHATSAPP_FROM,
      templateName,
      status: message.status
    },
    "Twilio WhatsApp template send"
  );

  return {
    success: true,
    provider: "twilio",
    messageSid: message.sid,
    status: message.status
  };
}