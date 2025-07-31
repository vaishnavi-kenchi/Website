const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();
const PORT = 5000;

app.use(cors());

const pool = new Pool({
  user: "postgres",           // Ask Developer 2
  host: "localhost",          // Or IP if remote
  database: "inventory_system",   // Actual DB name
  password: "12345",   // Secure password
  port: 5432,
});

app.get("/api/products", async (req, res) => {
  try {
    const result = await pool.query("SELECT name, quantity AS qty FROM products");
    res.json(result.rows);
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});
app.get('/', (req, res) => {
  res.send('🎉 Inventory Management Backend is Running!');
});


app.listen(PORT, () => {
  console.log(`✅ Backend running at http://localhost:${PORT}`);
});
