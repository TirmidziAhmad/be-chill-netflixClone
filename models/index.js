const User = require("./user.model");

const initializeModels = async () => {
  await User.sync();
};

module.exports = { User, initializeModels };
