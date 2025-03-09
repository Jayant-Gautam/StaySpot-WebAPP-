const Listing = require("../models/listing.js");
const Review = require("../models/review.js");

module.exports.createReview = async (req,res)=>{
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
}

module.exports.destroy = async (req,res) => {
    let {id, reviewId} = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review Deleted!");
    res.redirect(`/listings/${id}`);
}