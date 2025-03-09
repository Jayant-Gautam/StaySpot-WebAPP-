const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveUrl } = require("../middlewares.js");
const userController = require('../controllers/users.js')

router.get("/signup", userController.renderSignUpPage)

router.post("/signup", wrapAsync(userController.signup));
router.get("/login", userController.renderLoginPage)

router.post("/login", saveUrl, passport.authenticate("local", {failureRedirect : "/login", failureFlash : true}), wrapAsync(userController.login));

router.get("/logout", userController.logout)

module.exports = router;