module.exports = (app) => {
  const auth = require("../controllers/auth.controller.js");
  var router = require("express").Router();

  /**
   * POST /api/auth/register
   */
  router.post("/register", auth.register);

  /**
   * POST /api/auth/login
   */
  router.post("/login", auth.login);

  app.use("/api/auth", router);
};
