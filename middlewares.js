const expressError = require("./utils/expressError.js");
const {listingSchema, reviewSchema} = require("./validateSchema.js");
const Listing = require("./models/listing.js");
const Review = require("./models/review.js");

module.exports.validateListing = (req,res,next) => {

    let {error} = listingSchema.validate(req.body);
    if(error){
        throw new expressError(400, error.message);
    }
    else {
        next()
    }
}
module.exports.isLoggedIn = (req,res,next) => {
    if(req.isAuthenticated()){
        next();
    }
    else{
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "You must be Logged in!");
        res.redirect("/login");
    }
}

module.exports.saveUrl = (req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    else{
        res.locals.redirectUrl = "/listings";
    }
    next();
};

module.exports.validateReview = (req,res,next) => {
    let {error} = reviewSchema.validate(req.body);
    if(error){
        throw new expressError(400, error.message);
    }
    else {
        next()
    }
};

module.exports.isOwner = async(req,res,next)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if(listing.owner.equals(res.locals.userLoggedin._id)){
        next();
    }
    else{
        req.flash("error", "You are not the Owner for this listing");
        return res.redirect(`/listings/${id}`);
    }
}
module.exports.isAuthor = async(req,res,next)=>{
    let {id,reviewId} = req.params;
    let review = await Review.findById(reviewId);
    if(review.author.equals(res.locals.userLoggedin._id)){
        next();
    }
    else{
        req.flash("error", "You are not the Owner for this review");
        return res.redirect(`/listings/${id}`);
    }
}