import { db } from "../db/database.js";

const getCustomerStmt = db.prepare(`
  SELECT id, name
  FROM customers
  WHERE id = ?
`);

const getRecipientsStmt = db.prepare(`
  SELECT phone
  FROM customer_recipients
  WHERE customer_id = ?
`);

const getTemplatesStmt = db.prepare(`
  SELECT active_template, cleared_template
  FROM customer_templates
  WHERE customer_id = ?
`);

export async function getCustomerById(customerId) {
  const customer = getCustomerStmt.get(customerId);

  if (!customer) {
    return null;
  }

  const recipients = getRecipientsStmt.all(customerId).map((row) => row.phone);
  const templates = getTemplatesStmt.get(customerId);

  return {
    ...customer,
    recipients,
    templates: {
      ACTIVE: templates?.active_template,
      CLEARED: templates?.cleared_template
    }
  };
}