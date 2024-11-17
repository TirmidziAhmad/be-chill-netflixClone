const { Router } = require("express");

const authController = require("../controllers/auth.controller");

const routerAuth = Router();

routerAuth.post("/login", authController.login);
routerAuth.post("/register", authController.register);
routerAuth.get("/verify/:token", authController.verifyEmail);

module.exports = routerAuth;
