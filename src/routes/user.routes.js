const { Router } = require("express");
const { userController } = require("../controllers/index.controller");
const routerUser = Router();
const authMiddleware = require("../middleware/authMiddleware");

require("dotenv").config({ path: "../.env" });

routerUser.get("/", userController.getAllUsers);
routerUser.post("/login", userController.login);
routerUser.post("/register", userController.register);
routerUser.patch("/update", authMiddleware, userController.updateUser);
routerUser.delete("/delete", authMiddleware, userController.deleteUser);

module.exports = routerUser;
