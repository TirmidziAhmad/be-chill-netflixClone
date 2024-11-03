const UserService = require("../services/user.service");
const ResponseUtil = require("../utils/response.util");

class UserController {
  static async createUser(req, res) {
    try {
      const user = await UserService.createUser(req.body);
      return ResponseUtil.success(res, user, "User created successfully");
    } catch (error) {
      return ResponseUtil.error(res, error.message);
    }
  }

  static async getUsers(req, res) {
    try {
      const users = await UserService.getUsers();
      return ResponseUtil.success(res, users);
    } catch (error) {
      return ResponseUtil.error(res, error.message);
    }
  }
}

module.exports = UserController;
