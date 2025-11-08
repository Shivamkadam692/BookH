const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");

const Listing = require('../models/listing.js');
const { isLoggedIn, isOwner, validateListing } = require('../middleware.js');  

const listingController = require("../controllers/listings.js");




//index route
router.get("/", wrapAsync(listingController.index));


// new route
router.get("/new",isLoggedIn, listingController.newForm);


//Show route
router.get("/:id", wrapAsync(listingController.showListings));

//Create Route
router.post("/", isLoggedIn, validateListing ,wrapAsync(listingController.createListing));


// edit route
router.get("/:id/edit", isLoggedIn,isOwner, wrapAsync(listingController.editForm));




//Update route

router.put("/:id",validateListing, isLoggedIn,isOwner, wrapAsync(listingController.updateForm));


//Delete route
router.delete("/:id",isLoggedIn,isOwner, wrapAsync(listingController.deletelisting));


module.exports = router;