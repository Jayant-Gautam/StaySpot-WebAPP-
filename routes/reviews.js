const express = require("express");
const router = express.Router({mergeParams : true});
// const {reviewSchema} = require("../validateSchema.js");
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const wrapAsync = require("../utils/wrapAsync.js");
// const expressError = require("../utils/expressError.js");
const { isLoggedIn, validateReview, isAuthor} = require("../middlewares.js");

// review validating middleware


// reviews create route
router.post("/",isLoggedIn,validateReview, wrapAsync(async (req,res)=>{
    let listing = await Listing.findById(req.params.id);
    // console.log(req.body);
    let review = new Review(req.body.review);
    review.author = req.user._id;
    await review.save();
    listing.reviews.push(review);
    await listing.save();
    console.log("review saved");
    req.flash("success", "Review Added!");
    res.redirect(`/listings/${req.params.id}`);
    // res.send("added");
}));

// review delete route
router.delete("/:reviewId",isLoggedIn,isAuthor, wrapAsync(async (req,res) => {
    let {id, reviewId} = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review Deleted!");
    res.redirect(`/listings/${id}`);
}));

module.exports = router;
