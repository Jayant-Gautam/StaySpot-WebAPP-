const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const ejsMate = require("ejs-mate");
const expressError = require("./utils/expressError.js");
const listingRouter = require("./routes/listings.js");
const reviewRouter = require("./routes/reviews.js");
const userRouter = require("./routes/users.js");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

// home route
app.get("/", (req,res)=>{
    res.send("request recieved");
});

// for session
const sessionOptions = {
    secret : "secretCode",
    resave : false,
    saveUninitialized : true,
    cookie : {
        expires : Date.now() + (7 * 24 * 60 * 60 * 1000),
        maxAge : (7 * 24 * 60 * 60 * 1000),
        httpOnly : true,
    },
};
app.use(session(sessionOptions));

// for passport
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate())); // to authenticate the user
passport.serializeUser(User.serializeUser()); // to store the info in session
passport.deserializeUser(User.deserializeUser()); // to remove the info from session

app.use(flash());
app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.userLoggedin = req.user;
    next();
});



// for requests other than post and get
const methodOverride = require("method-override");
app.use(methodOverride("_method"));

// static files
app.use(express.static(path.join(__dirname, "/public")));

// setting up ejs
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));
app.engine("ejs", ejsMate);


// Connecting to data base
const MONGO_URL = "mongodb://127.0.0.1:27017/StaySpot";
async function main(){
    await mongoose.connect(MONGO_URL);
}
main().then(()=>{
    console.log("Data Base connected");
}).catch((err)=>{
    console.log(err);
});

// establishing port connection
const port = 3000;
app.use(express.urlencoded({extended : true}));
app.listen(port, ()=>{
    console.log("listening to port : ", port);
});

// connecting routes
app.use("/listings", listingRouter);
app.use("/listings/:id/review", reviewRouter);
app.use("/", userRouter);

app.get("/register", async (req, res)=>{
    let fakeuser = {
        username : "Jayant",
        email : "jayant10449@gmail.com",
    }
    let user = await User.register(fakeuser, "Jayantjig");
    console.log(user);
})

app.all("*", (req, res, next) => {
    next(new expressError(404, "Page Not Found"));
})

app.use((err, req, res, next) => {
    let {statusCode = 500, message = "something Went Wrong"} = err;
    console.log(message);
    res.status(statusCode).render("error.ejs", {statusCode});
});