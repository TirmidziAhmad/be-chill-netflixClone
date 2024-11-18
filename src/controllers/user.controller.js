const db = require("../db/db.config");
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

  async getUser(req, res, next) {
    try {
      const { id } = req.params;
      const result = await db.query('SELECT user_id, username, email FROM "user" WHERE user_id = $1', [id]);
      if (result.rows.length === 0) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(result.rows[0]);
    } catch (error) {
      next(error);
    }
  },

  async createUser(req, res, next) {
    try {
      const { username, email, password } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10);
      const result = await db.query('INSERT INTO "user" (username, email, password) VALUES ($1, $2, $3) RETURNING *', [username, email, hashedPassword]);
      res.json(result.rows[0]);
    } catch (error) {
      next(error);
    }
  },

  async updateUser(req, res, next) {
    try {
      const id = req.user.userId;
      const { username, email, password } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10);
      const result = await db.query('UPDATE "user" SET username = $1, email = $2, password = $3 WHERE user_id = $4 RETURNING *', [username, email, hashedPassword, id]);
      if (result.rows.length === 0) {
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

  async uploadImage(req, res, next) {
    try {
      const id = req.user.userId;
      const image = req.file.path;

      if (!image) {
        return res.status(400).json({ message: "No image uploaded" });
      }

      const result = await db.query('UPDATE "user" SET photo = $1 WHERE user_id = $2 RETURNING *', [image, id]);

      if (result.rows.length === 0) {
        return res.status(404).json({ message: "Photo not inserted to database" });
      }

      res.json(result.rows[0]);
    } catch (error) {
      next(error);
    }
  },
};

module.exports = userController;
