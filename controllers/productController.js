const { createProduct, getProducts } = require("../models/Product");

async function create(req, res) {
  const { name, description } = req.body;

  if (!name || !description)
    return res.status(400).json({ error: "All fields are required" });

  try {
    const productId = await createProduct(name, description, req.user.id);
    res
      .status(201)
      .json({ message: "Product created successfully", productId });
  } catch (err) {
    res.status(500).json({ error: "Product creation failed" });
  }
}

async function getAll(req, res) {
  try {
    const products = await getProducts();
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ error: "Failed to retrieve products" });
  }
}

module.exports = { create, getAll };
