const User = require("../models/user.js");

module.exports.renderSignUpPage = (req,res)=>{
    res.render("./users/signup.ejs");
}
module.exports.signup = async(req,res)=>{
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
}

module.exports.renderLoginPage = (req,res)=>{
    res.render("./users/login.ejs");
}

module.exports.login = async(req,res)=>{
    req.flash("success", "Welcome back to StaySpot!");
    res.redirect(res.locals.redirectUrl);
}

module.exports.logout = (req,res,next)=>{
    req.logout((err) => {
        if(err){
            next(err);
        }
        req.flash("success", "Successfully Logged Out!");
        res.redirect("/listings");
    })
}