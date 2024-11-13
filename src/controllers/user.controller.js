const db = require("../db/db.config");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const userController = {
  async getAllUsers(req, res, next) {
    try {
      const result = await db.query('SELECT user_id, username, email FROM "user"');
      if (result.rows.length === 0) {
        return res.status(204).json({ message: "No users found" });
      }
      res.json(result.rows);
    } catch (error) {
      next(error);
    }
  },

  async login(req, res, next) {
    try {
      const { username, password } = req.body;

      // Validate input
      if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
      }

      // Find user by username
      const result = await db.query('SELECT * FROM "user" WHERE username = $1', [username]);

      if (result.rows.length === 0) {
        return res.status(404).json({ message: "User not found" });
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

      // Insert new user
      const result = await db.query('INSERT INTO "user" (username, email, password) VALUES ($1, $2, $3) RETURNING user_id, username, email', [username, email, hashedPassword]);

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
      });
    } catch (error) {
      next(error);
    }
  },

  async updateUser(req, res, next) {
    try {
      const { id } = req.params;
      const { username, email, password } = req.body;

      // Validate input
      if (!username && !email && !password) {
        return res.status(400).json({ message: "No update data provided" });
      }

      // Prepare update query
      const updates = [];
      const values = [];
      let paramCount = 1;

      if (username) {
        updates.push(`username = $${paramCount}`);
        values.push(username);
        paramCount++;
      }

      if (email) {
        updates.push(`email = $${paramCount}`);
        values.push(email);
        paramCount++;
      }

      if (password) {
        const hashedPassword = await bcrypt.hash(password, 10);
        updates.push(`password = $${paramCount}`);
        values.push(hashedPassword);
        paramCount++;
      }

      values.push(id);

      // Construct and execute update query
      const query = `
        UPDATE "user" 
        SET ${updates.join(", ")} 
        WHERE user_id = $${paramCount} 
        RETURNING user_id, username, email
      `;

      const result = await db.query(query, values);

      if (!result.rows[0]) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json(result.rows[0]);
    } catch (error) {
      next(error);
    }
  },

  async deleteUser(req, res, next) {
    try {
      const { id } = req.params;
      const result = await db.query('DELETE FROM "user" WHERE user_id = $1 RETURNING user_id', [id]);

      if (!result.rows[0]) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json({ message: "User deleted successfully", userId: result.rows[0].user_id });
    } catch (error) {
      next(error);
    }
  },
};

module.exports = userController;
