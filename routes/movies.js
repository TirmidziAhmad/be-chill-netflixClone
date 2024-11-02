const { Router } = require("express");
const router = Router();

const moviesRoute = router;
moviesRoute.get("/", (req, res) => {
  res.send("movies");
});

module.exports = moviesRoute;
