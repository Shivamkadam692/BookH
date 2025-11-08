const express = require("express");
const router = express.Router();
const user = require('../models/user.js');
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");

//Signup routes

router.get('/signup', (req, res) => {
    res.render('users/signup.ejs');
});

router.post('/signup', wrapAsync(async (req, res) => {

    try {
        let { username, email, password } = req.body;
        const newUser = new user({ email, username });
        const registeredUser = await user.register(newUser, password);
        req.login(registeredUser, (err) => {
            if (err) {
                return next(err);
            }
            req.flash('success', 'Welcome to BookH!');
            res.redirect('/listings');
        })
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('/signup');
    }

}));



//login routes

router.get('/login', (req, res) => {
    res.render('users/login.ejs');
});

router.post('/login',saveRedirectUrl, passport.authenticate("local", { failureRedirect: '/login', failureFlash: true }), wrapAsync(async (req, res) => {


    req.flash('success', 'Welcome Back!');
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
}));


//logout route

router.get('/logout', (req, res, next) => {
    req.logout((err) => {
        if (err) {

            return next(err);
        }
        req.flash('success', "Your have logged out!");
        res.redirect('/listings');
    });
});

module.exports = router;