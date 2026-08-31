const rateLimit = require("express-rate-limit");

const loginLimit = rateLimit({
  windowMs: 10 * 60 * 1000,
  limit: 10,
  message: {
    message: "Too many login attempts, Please try again later",
  },
});

const registerLimit = rateLimit({
  windowMs: 10 * 60 * 1000,
  limit: 10,
  message: {
    message: "Too many register attempts, Please try again later",
  },
});

module.exports = { loginLimit, registerLimit };
