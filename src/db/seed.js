import { db } from "./database.js";

const insertCustomer = db.prepare(`
  INSERT OR REPLACE INTO customers (id, name)
  VALUES (?, ?)
`);

const insertRecipient = db.prepare(`
  INSERT OR IGNORE INTO customer_recipients (customer_id, phone)
  VALUES (?, ?)
`);

const insertTemplates = db.prepare(`
  INSERT OR REPLACE INTO customer_templates (customer_id, active_template, cleared_template)
  VALUES (?, ?, ?)
`);

insertCustomer.run("cust_001", "Test Customer");
insertRecipient.run("cust_001", "+3725539033");
insertTemplates.run("cust_001", "fault_alert_v1", "fault_cleared_v1");

console.log("Seed completed");