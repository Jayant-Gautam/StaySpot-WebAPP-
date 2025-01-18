const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const Review = require("./models/review.js");
const path = require("path");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const expressError = require("./utils/expressError.js");
const {reviewSchema,listingSchema} = require("./validateSchema.js");

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
const port = 8080;
app.use(express.urlencoded({extended : true}));
app.listen(port, ()=>{
    console.log("listening to port : ", port);
});

// listing validating middleware
const validateListing = (req,res,next) => {
    let {error} = listingSchema.validate(req.body);
    if(error){
        throw new expressError(400, error.message);
    }
    else {
        next()
    }
}

// review validating middleware
const validateReview = (req,res,next) => {
    let {error} = reviewSchema.validate(req.body);
    if(error){
        throw new expressError(400, error.message);
    }
    else {
        next()
    }
}

// home route
app.get("/", (req,res)=>{
    res.send("request recieved");
});

app.get("/listings", wrapAsync(async (req,res)=>{
    const allListings = await Listing.find();
    // console.log(allListings);
    res.render("./listings/index.ejs", {allListings});
}));

// edit route
app.get("/listings/:id/edit", wrapAsync(async (req,res)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    res.render("listings/edit.ejs", {listing});
}));
app.put("/listings/:id", validateListing, wrapAsync(async (req,res)=>{
    let {id} = req.params;
    listing = await Listing.findByIdAndUpdate(id,listing);
    res.redirect(`/listings/${id}`);
    // console.log(listing);
}));

// create route
app.get("/listings/new", (req,res)=>{
    res.render("listings/new.ejs");
});
app.post("/listings", validateListing, wrapAsync(async (req,res,next)=>{
        let listing = new Listing(req.body.listing);
        await listing.save();
        res.redirect("/listings");
}));

// show route
app.get("/listings/:id", wrapAsync(async (req,res) => {
    let {id} = req.params;
    let listing = await Listing.findById(id).populate("reviews");
    res.render("listings/show.ejs", {listing});
}));

// reviews create route
app.post("/listings/:id/review",validateReview, wrapAsync(async (req,res)=>{
    let listing = await Listing.findById(req.params.id);
    // console.log(req.body);
    let review = new Review(req.body.review);
    await review.save();
    listing.reviews.push(review);
    await listing.save();
    console.log("review saved");
    res.redirect(`/listings/${req.params.id}`);
    // res.send("added");
}));

// delete route
app.delete("/listings/:id", wrapAsync(async (req,res)=>{
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    // console.log(listing);
    res.redirect("/listings");
}));

// review delete route
app.delete("/listings/:id/review/:reviewId", wrapAsync(async (req,res) => {
    let {id, reviewId} = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/listings/${id}`);
}))

app.all("*", (req, res, next) => {
    next(new expressError(404, "Page Not Found"));
})

app.use((err, req, res, next) => {
    let {statusCode = 500, message = "something Went Wrong"} = err;
    console.log(message);
    res.status(statusCode).render("error.ejs", {statusCode});
});