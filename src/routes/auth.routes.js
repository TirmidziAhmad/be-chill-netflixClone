const { Router } = require("express");

const authController = require("../controllers/auth.controller");

const routerAuth = Router();

routerAuth.post("/login", authController.login);
routerAuth.post("/register", authController.register);

module.exports = routerAuth;
