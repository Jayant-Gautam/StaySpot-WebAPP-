const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveUrl } = require("../middlewares.js");

router.get("/signup", (req,res)=>{
    res.render("./users/signup.ejs");
})

router.post("/signup", wrapAsync(async(req,res)=>{
    try{
        let {username,email,password} = req.body;
        let newUser = new User({
            username,
            email,
        })
        newUser = await User.register(newUser,password);
        console.log(newUser);
        req.login(newUser,(err)=>{
            if(err){
                return next(err);
            }
            req.flash("success", "Welcome to StaySpot!");
            res.redirect("/listings");
        })
    }
    catch(err){
        req.flash("error", err.message);
        res.redirect("/signup");
    }
}));
router.get("/login", (req,res)=>{
    res.render("./users/login.ejs");
})

router.post("/login", saveUrl, passport.authenticate("local", {failureRedirect : "/login", failureFlash : true}), wrapAsync(async(req,res)=>{
    req.flash("success", "Welcome back to StaySpot!");
    res.redirect(res.locals.redirectUrl);
}));

router.get("/logout", (req,res,next)=>{
    req.logout((err) => {
        if(err){
            next(err);
        }
        req.flash("success", "Successfully Logged Out!");
        res.redirect("/listings");
    })
})

module.exports = router;