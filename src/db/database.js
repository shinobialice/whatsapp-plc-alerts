import Database from "better-sqlite3";
import path from "path";

const dbPath = path.resolve("data/app.db");
export const db = new Database(dbPath);

db.exec(`
  CREATE TABLE IF NOT EXISTS customers (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS customer_recipients (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    customer_id TEXT NOT NULL,
    phone TEXT NOT NULL,
    UNIQUE(customer_id, phone),
    FOREIGN KEY (customer_id) REFERENCES customers(id)
  );

  CREATE TABLE IF NOT EXISTS customer_templates (
    customer_id TEXT PRIMARY KEY,
    active_template TEXT NOT NULL,
    cleared_template TEXT NOT NULL,
    FOREIGN KEY (customer_id) REFERENCES customers(id)
  );

  CREATE TABLE IF NOT EXISTS alert_state (
    alert_key TEXT PRIMARY KEY,
    customer_id TEXT NOT NULL,
    machine_id TEXT NOT NULL,
    fault_code TEXT NOT NULL,
    fault_text TEXT,
    status TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );
`);