const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const listingController = require('../controllers/listings.js')

const { validateListing, isLoggedIn, isOwner } = require("../middlewares.js");
// const isLoggedIn = require("../middlewares.js");



router.get("/", wrapAsync(listingController.index));

// edit route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm));
router.put("/:id", isLoggedIn, isOwner, validateListing, wrapAsync(listingController.editListing));

// create route
router.get("/new", isLoggedIn, listingController.renderCreateForm);
router.post("/", isLoggedIn, validateListing, wrapAsync(listingController.createListing));

// show route
router.get("/:id", wrapAsync(listingController.show));

// delete route
router.delete("/:id", isLoggedIn, isOwner, wrapAsync(listingController.destroy));

module.exports = router;