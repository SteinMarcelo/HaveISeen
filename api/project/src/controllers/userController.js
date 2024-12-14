const { body, validationResult } = require("express-validator");
const pool = require("../config/database");
const {
  generateSalt,
  hashPassword,
  verifyPassword,
  generateToken,
} = require("../utils/auth");

const registerValidation = [
  body("username").trim().isLength({ min: 3 }).escape(),
  body("email").isEmail().normalizeEmail(),
  body("password").isLength({ min: 6 }),
];

const loginValidation = [
  body("email").isEmail().normalizeEmail(),
  body("password").exists(),
];

const register = async (req, res) => {
  try {
    console.log("Register endpoint called.");
    console.log("Request body:", req.body);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log("Validation errors:", errors.array());
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, email, password } = req.body;

    console.log("Checking if user already exists...");
    const [existingUsers] = await pool.execute(
      "SELECT * FROM users WHERE email = ? OR username = ?",
      [email, username]
    );
    console.log("Existing users:", existingUsers);

    if (existingUsers.length > 0) {
      console.log("User already exists.");
      return res.status(400).json({ error: "User already exists" });
    }

    console.log("Generating salt and hashing password...");
    const salt = generateSalt();
    const hashedPassword = await hashPassword(password, salt);
    console.log("Salt generated:", salt);
    console.log("Password hashed successfully.");

    console.log("Inserting new user into database...");
    const [result] = await pool.execute(
      "INSERT INTO users (username, email, password_hash, salt) VALUES (?, ?, ?, ?)",
      [username, email, hashedPassword, salt]
    );
    console.log("Insert result:", result);

    const token = generateToken(result.insertId);
    console.log("Token generated:", token);

    res.status(201).json({
      message: "User registered successfully",
      token,
    });
  } catch (error) {
    console.error("Error in register:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const login = async (req, res) => {
  try {
    console.log("Login endpoint called.");
    console.log("Request body:", req.body);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log("Validation errors:", errors.array());
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    console.log("Checking if user exists...");
    const [users] = await pool.execute("SELECT * FROM users WHERE email = ?", [
      email,
    ]);
    console.log("Users found:", users);

    if (users.length === 0) {
      console.log("Invalid credentials: User not found.");
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const user = users[0];
    console.log("Verifying password...");
    const isValidPassword = await verifyPassword(
      password,
      user.salt,
      user.password_hash
    );
    console.log("Password verification result:", isValidPassword);

    if (!isValidPassword) {
      console.log("Invalid credentials: Password mismatch.");
      return res.status(401).json({ error: "Invalid credentials" });
    }

    console.log("Generating token...");
    const token = generateToken(user.id);
    console.log("Token generated:", token);

    res.json({
      message: "Login successful",
      token,
    });
  } catch (error) {
    console.error("Error in login:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getMovieApiKey = async (req, res) => {
  try {
    // Buscar a chave da API na tabela "tokens"
    const [result] = await pool.execute(
      "SELECT api_key FROM tokens WHERE type = ?",
      ["movie"]
    );

    if (result.length === 0) {
      return res.status(404).json({ error: "API key not found" });
    }

    const apiKey = result[0].api_key;

    // Retornar a chave da API de filmes
    res.json({ apiKey });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  registerValidation,
  loginValidation,
  register,
  login,
  getMovieApiKey,
};
