const db = require("../db/db.config");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const uuid = require("uuid");
const sendingEmail = require("../service/sendingEmail.service");
const authController = {
  async login(req, res, next) {
    try {
      const { email, password } = req.body;

      // Validate input
      if (!email || !password) {
        return res.status(400).json({ message: "Username and password are required" });
      }

      // Find user by username
      const result = await db.query('SELECT * FROM "user" WHERE email = $1', [email]);

      if (result.rows.length === 0) {
        return res.status(404).json({ message: "User not found when loged in" });
      }

      // Compare passwords
      const user = result.rows[0];
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // Generate token
      const token = jwt.sign(
        {
          userId: user.user_id,
          username: user.username,
        },
        process.env.SECRET_KEY,
        { expiresIn: "1h" }
      );

      res.status(200).json({
        token,
        userId: user.user_id,
        username: user.username,
      });
    } catch (error) {
      next(error);
    }
  },

  async register(req, res, next) {
    try {
      const { username, email, password } = req.body;

      // Validate input
      if (!username || !email || !password) {
        return res.status(400).json({ message: "All fields are required" });
      }

      // Check if user already exists
      const existingUser = await db.query('SELECT * FROM "user" WHERE username = $1 OR email = $2', [username, email]);

      if (existingUser.rows.length > 0) {
        return res.status(409).json({ message: "Username or email already exists" });
      }

      // Hash password
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      //Generate UUID token
      const userTokenActivation = uuid.v4();
      // Insert new user
      const result = await db.query('INSERT INTO "user" (username, email, password, isverified, token) VALUES ($1, $2, $3, $4, $5) RETURNING user_id, username, email, isverified, token', [
        username,
        email,
        hashedPassword,
        "false",
        userTokenActivation,
      ]);

      // Send verification email
      await sendingEmail(email, userTokenActivation);

      // Generate token
      const token = jwt.sign(
        {
          userId: result.rows[0].user_id,
          username: result.rows[0].username,
        },
        process.env.SECRET_KEY,
        { expiresIn: "1h" }
      );

      res.status(201).json({
        token,
        user: result.rows[0],
        userTokenActivation,
      });
    } catch (error) {
      next(error);
    }
  },

  async verifyEmail(req, res, next) {
    try {
      const { token } = req.params;
      const user = await db.query('SELECT * FROM "user" WHERE token = $1', [token]);
      if (user.rows.length === 0) {
        return res.status(404).json({ message: "User not found" });
      }
      await db.query('UPDATE "user" SET isverified = $1, token = $2 WHERE token = $3', ["true", "null", token]);
      res.status(200).json({ message: "Email verified successfully" });
    } catch (error) {
      next(error);
    }
  },
};

module.exports = authController;
