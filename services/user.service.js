const { User } = require("../models");

class UserService {
  static async createUser(userData) {
    return await User.create(userData);
  }

  static async getUsers() {
    return await User.findAll({
      attributes: { exclude: ["password"] },
    });
  }
}

module.exports = UserService;
