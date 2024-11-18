const { Router } = require("express");
const { userController } = require("../controllers/index.controller");
const routerUser = Router();
const authMiddleware = require("../middleware/authMiddleware");
const upload = require("../middleware/upload.middleware");
require("dotenv").config({ path: "../.env" });

routerUser.get("/", userController.getAllUsers);
routerUser.get("/:id", userController.getUser);
routerUser.post("/create", userController.createUser);
routerUser.patch("/update", authMiddleware, userController.updateUser);
routerUser.delete("/delete", authMiddleware, userController.deleteUser);
routerUser.post("/upload", authMiddleware, upload, userController.uploadImage);
module.exports = routerUser;
