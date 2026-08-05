const express = require("express");
const authRouter = express.Router();

const authController = require("../controllers/authController.js");

const isAuth = (req, res, next) => {
  if (req.session.isLoggedIn) {
    return next();
  }
  return res.redirect("/login");
};

authRouter.get("/login", authController.getLogin);
authRouter.post("/login", authController.postLogin);
authRouter.post("/logout", authController.postLogout);
authRouter.get("/signup", authController.getSignup);
authRouter.post("/signup", authController.postSignup);
authRouter.get("/profile", isAuth, authController.getProfile);

module.exports = authRouter;