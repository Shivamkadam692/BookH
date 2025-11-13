const express = require("express");
const router = express.Router();
const user = require('../models/user.js');
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl, isLoggedIn } = require("../middleware.js");

const userController = require("../controllers/users.js");
const dashboardController = require("../controllers/dashboard.js");

//Signup routes

router.get('/signup', userController.rendersignup);

router.post('/signup', wrapAsync(userController.signup));



//login routes

router.get('/login', userController.renderlogin );

router.post('/login',saveRedirectUrl, passport.authenticate("local", { failureRedirect: '/login', failureFlash: true }), wrapAsync(userController.login));


//logout route

router.get('/logout', userController.logout );

// dashboard
router.get('/dashboard', isLoggedIn, wrapAsync(dashboardController.overview));

module.exports = router;