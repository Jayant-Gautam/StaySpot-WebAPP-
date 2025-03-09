const Listing = require("../models/listing.js");
const Review = require("../models/review.js");

module.exports.index = async (req, res) => {
        const allListings = await Listing.find();
        res.render("./listings/index.ejs", { allListings });
}

module.exports.show = async (req, res) => {
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
}

module.exports.destroy = async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    // console.log(listing);
    req.flash("success", "Listing Removed!");
    res.redirect("/listings");
}

module.exports.renderCreateForm = (req, res) => {
    res.render("listings/new.ejs");
}

module.exports.createListing = async (req, res, next) => {
    let listing = new Listing(req.body.listing);
    listing.owner = req.user._id;
    await listing.save();
    req.flash("success", "Listing Added!");
    res.redirect("/listings");
}

module.exports.renderEditForm = async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    res.render("listings/edit.ejs", { listing });
}

module.exports.editListing = async (req, res) => {
    let { id } = req.params;
    listing = await Listing.findByIdAndUpdate(id, req.body.listing);
    res.redirect(`/listings/${id}`);
    // console.log(listing);
}