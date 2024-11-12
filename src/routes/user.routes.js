const { Router } = require("express");
const { userController } = require("../controllers/index.controller");

const routerUser = Router();

routerUser.get("/", userController.getAllUsers);
routerUser.get("/:id", userController.getOneUser);
routerUser.post("/", userController.createUser);
routerUser.patch("/:id", userController.updateUser);
routerUser.delete("/:id", userController.deleteUser);

module.exports = routerUser;
