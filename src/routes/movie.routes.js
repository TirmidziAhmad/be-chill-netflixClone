const { Router } = require("express");
const movieController = require("../controllers/movie.controller");

const routerMovie = Router();

routerMovie.get("/", movieController.getAllMovies);
routerMovie.get("/:id", movieController.getOneMovie);
routerMovie.post("/", movieController.createMovie);
routerMovie.patch("/:id", movieController.updateMovie);
routerMovie.delete("/:id", movieController.deleteMovie);

module.exports = routerMovie;
