// models/Product.js
const pool = require("../config/db");

async function createProduct(name, description, userId) {
  const [result] = await pool.execute(
    "INSERT INTO products (name, description, user_id) VALUES (?, ?, ?)",
    [name, description, userId]
  );
  return result.insertId;
}

async function getProducts() {
  const [rows] = await pool.execute("SELECT * FROM products");
  return rows;
}

module.exports = { createProduct, getProducts };
