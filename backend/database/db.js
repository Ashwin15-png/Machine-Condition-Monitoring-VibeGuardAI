const sqlite3 = require("sqlite3").verbose();
const path = require("path");

// Create/Open database
const db = new sqlite3.Database(
  path.join(__dirname, "machine_monitor.db"),
  (err) => {
    if (err) {
      console.error("Database connection failed:", err.message);
    } else {
      console.log("✅ SQLite Connected");

      db.run(`
        CREATE TABLE IF NOT EXISTS machine_readings (
          reading_id INTEGER PRIMARY KEY AUTOINCREMENT,
          machine_id TEXT NOT NULL,
          vibration REAL NOT NULL,
          temperature REAL NOT NULL,
          alert_flag TEXT NOT NULL,
          recorded_at TEXT NOT NULL
        )
      `, (err) => {
        if (err) {
          console.error("Table creation failed:", err.message);
        } else {
          console.log("✅ machine_readings table ready");
        }
      });
    }
  }
);

module.exports = db;