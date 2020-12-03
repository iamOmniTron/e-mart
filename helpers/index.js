const bcrypt = require("bcrypt");

module.exports = {
  validatePassword: async (input, password) => {
    const isMatch = await bcrypt.compare(input, password);
    return isMatch;
  },
  hash: async (password, salt) => {
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
  },
};
