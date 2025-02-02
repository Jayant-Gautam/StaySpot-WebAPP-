const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const wrapAsync = require("../utils/wrapAsync.js");

const { validateListing, isLoggedIn, isOwner } = require("../middlewares.js");
// const isLoggedIn = require("../middlewares.js");



router.get("/", wrapAsync(async (req, res) => {
    const allListings = await Listing.find();
    // console.log(allListings);
    res.render("./listings/index.ejs", { allListings });
}));

// edit route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    res.render("listings/edit.ejs", { listing });
}));
router.put("/:id", isLoggedIn, isOwner, validateListing, wrapAsync(async (req, res) => {
    let { id } = req.params;
    listing = await Listing.findByIdAndUpdate(id, req.body.listing);
    res.redirect(`/listings/${id}`);
    // console.log(listing);
}));

// create route
router.get("/new", isLoggedIn, (req, res) => {
    res.render("listings/new.ejs");
});
router.post("/", isLoggedIn, validateListing, wrapAsync(async (req, res, next) => {
    let listing = new Listing(req.body.listing);
    listing.owner = req.user._id;
    await listing.save();
    req.flash("success", "Listing Added!");
    res.redirect("/listings");
}));

// show route
router.get("/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id).populate({
        path: "reviews", populate: {
            path: "author"
        },
    });

    if (!listing) {
        req.flash("error", "Listing does not exists!");
        res.redirect("/listings");
        return;
    }
    res.render("listings/show.ejs", { listing });
}));

// delete route
router.delete("/:id", isLoggedIn, isOwner, wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    // console.log(listing);
    req.flash("success", "Listing Removed!");
    res.redirect("/listings");
}));

module.exports = router;