const express = require("express");
const router = express.Router();
const passport = require("passport");

//Error Handlers
const catchAsync = require("../utils/catchAsync");
const User = require('../models/user');
const userController = require("../controllers/users");

router.route("/register")
    .get(userController.renderUserForm)
    .post(catchAsync(userController.createUser));

router.route("/login")
    .get(userController.renderLoginForm)
    .post(passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), catchAsync(userController.userLogin));


router.get("/logout", userController.userLogout);


module.exports = router;