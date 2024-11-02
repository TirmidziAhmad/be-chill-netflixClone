const { Router } = require("express");

module.exports = Router()
  .get("/users", (req, res) => {
    res.send("users");
  })
  .post("/users/id", (req, res) => {
    res.send("users");
  });
