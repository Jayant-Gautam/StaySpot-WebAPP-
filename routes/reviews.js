const express = require("express");
const router = express.Router({mergeParams : true});
// const {reviewSchema} = require("../validateSchema.js");
const wrapAsync = require("../utils/wrapAsync.js");
// const expressError = require("../utils/expressError.js");
const { isLoggedIn, validateReview, isAuthor} = require("../middlewares.js");
const reviewController = require('../controllers/reviews.js')

// review validating middleware


// reviews create route
router.post("/",isLoggedIn,validateReview, wrapAsync(reviewController.createReview));

// review delete route
router.delete("/:reviewId",isLoggedIn,isAuthor, wrapAsync(reviewController.destroy));

module.exports = router;
