const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { createUser, getUserByEmail } = require("../models/User");
require("dotenv").config();

async function register(req, res) {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ error: "All fields are required" });

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const userId = await createUser(email, hashedPassword);
    res.status(201).json({ message: "User registered successfully", userId });
  } catch (err) {
    res.status(500).json({ error: "Registration failed" });
  }
}

async function login(req, res) {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ error: "All fields are required" });

  const user = await getUserByEmail(email);
  if (!user) return res.status(404).json({ error: "User not found" });

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword)
    return res.status(400).json({ error: "Invalid credentials" });

  const token = jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET,
    {
      expiresIn: "1h",
    }
  );
  res.json({ token });
}
async function getUserByEmailController(req, res) {
  const { email } = req.query;

  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  try {
    const user = await getUserByEmail(email);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ user });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch user details" });
  }
}

module.exports = { register, login, getUserByEmailController };
