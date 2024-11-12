const db = require("../db/db.config");

const userController = {
  async getAllUsers(req, res, next) {
    try {
      const result = await db.query('SELECT * FROM "user"');
      if (result.rows.length === 0) {
        return res.status(204).json({ message: "No users found" });
      }
      res.json(result.rows);
    } catch (error) {
      next(error);
    }
  },

  async getOneUser(req, res, next) {
    try {
      const { id } = req.params;
      const result = await db.query('SELECT * FROM "user" WHERE id = $1', [id]);
      if (!result.rows[0]) {
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
      const result = await db.query('INSERT INTO "user" (username, email, password) VALUES ($1, $2, $3) RETURNING *', [username, email, password]);
      res.status(201).json(result.rows[0]);
    } catch (error) {
      next(error);
    }
  },

  async updateUser(req, res, next) {
    try {
      const { id } = req.params;
      const { username, email, password } = req.body;
      const result = await db.query('UPDATE "user" SET username = $1, email = $2, password = $3 WHERE user_id = $4 RETURNING *', [username, email, password, id]);
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
      const result = await db.query('DELETE FROM "user" WHERE user_id = $1 RETURNING *', [id]);
      if (!result.rows[0]) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json({ message: "User deleted successfully" });
    } catch (error) {
      next(error);
    }
  },
};

module.exports = userController;
