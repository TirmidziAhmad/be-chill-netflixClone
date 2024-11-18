const db = require("../db/db.config");

const movieController = {
  async getAllMovies(req, res, next) {
    try {
      const result = await db.query("SELECT * FROM movie");
      if (result.rows.length === 0) {
        return res.status(204).json({ message: "No movies found" });
      }
      res.json(result.rows);
    } catch (error) {
      next(error); // Pass the error to the error-handling middleware
    }
  },

  async getOneMovie(req, res, next) {
    try {
      const id = req.user.movieId;
      const result = await db.query("SELECT * FROM movies WHERE id = $1", [id]);
      if (!result.rows[0]) {
        return res.status(404).json({ message: "Movie not found" });
      }
      res.json(result.rows[0]);
    } catch (error) {
      next(error);
    }
  },

  async getOneMovieById(req, res, next) {
    try {
      const { id } = req.params;
      const result = await db.query("SELECT * FROM movies WHERE id = $1", [id]);
      if (!result.rows[0]) {
        return res.status(404).json({ message: "Movie not found" });
      }
      res.json(result.rows[0]);
    } catch (error) {
      next(error);
    }
  },

  async sortMovieByRating(req, res, next) {
    try {
      const result = await db.query("SELECT * FROM movies ORDER BY rating DESC");
      if (result.rows.length === 0) {
        return res.status(204).json({ message: "No movies found" });
      }
      res.json(result.rows);
    } catch (error) {
      next(error);
    }
  },

  async searchMovieByTitle(req, res, next) {
    try {
      const { title } = req.params;
      const result = await db.query("SELECT * FROM movies WHERE title ILIKE $1", [`%${title}%`]);
      if (result.rows.length === 0) {
        return res.status(204).json({ message: "No movies found" });
      }
      res.json(result.rows);
    } catch (error) {
      next(error);
    }
  },

  async createMovie(req, res, next) {
    try {
      const movie = req.body;
      const result = await db.query("INSERT INTO movies (title, description, rating) VALUES ($1, $2, $3) RETURNING *", [movie.title, movie.description, movie.rating]);
      res.status(201).json(result.rows[0]);
    } catch (error) {
      next(error);
    }
  },

  async updateMovie(req, res, next) {
    try {
      const id = req.user.movieId;
      const movie = req.body;
      const result = await db.query("UPDATE movies SET title = $1, description = $2, rating = $3 WHERE id = $4 RETURNING *", [movie.title, movie.description, movie.rating, id]);
      if (!result.rows[0]) {
        return res.status(404).json({ message: "Movie not found" });
      }
      res.json(result.rows[0]);
    } catch (error) {
      next(error);
    }
  },

  async deleteMovie(req, res, next) {
    try {
      const { id } = req.params;
      await db.query("DELETE FROM movies WHERE id = $1", [id]);
      res.json({ message: "Movie deleted successfully" });
    } catch (error) {
      next(error);
    }
  },
};

module.exports = movieController;
