const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { listingSchema } = require('../schema.js');
const ExpressError = require("../utils/ExpressError.js");
const Listing = require('../models/listing.js');
const { isLoggedIn } = require('../middleware.js');  





const validateListing = (req, res, next) => {
    let {error} = listingSchema.validate(req.body);
    if (error){
        let errorMessage = error.details.map(el => el.message).join(",")
        throw new ExpressError(400, errorMessage);
    }else{
        next();
    }

};




//index route
router.get("/", wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
}));


// new route
router.get("/new",isLoggedIn, (req, res) => {
    
    res.render("listings/new.ejs")
})
//Show route
router.get("/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate('reviews');
    if (!listing) {
        req.flash('error', 'Cannot find that listing!');
        return res.redirect('/listings');
    }
    res.render("listings/show.ejs", { listing });
}));

//Create Route
router.post("/", isLoggedIn, validateListing ,wrapAsync(async (req, res, next) => {
    const newListing = new Listing(req.body.listing);
    await newListing.save()
    req.flash('success', 'Successfully made a new listing!');
    res.redirect("/listings");

}));

// edit route
router.get("/:id/edit", isLoggedIn, wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
     if (!listing) {
        req.flash('error', 'Cannot find that listing!');
        return res.redirect('/listings');
    }
    res.render("listings/edit.ejs", { listing })
}));

//Update route

router.put("/:id",validateListing, isLoggedIn, wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
     req.flash('success', 'Updated Listing!');
    res.redirect(`/listings/${id}`);
}));


//Delete route
router.delete("/:id",isLoggedIn, wrapAsync(async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log("deleted listing:", deletedListing);
    req.flash('success', 'Successfully Deleted a listing!');
    res.redirect("/listings");
}));


module.exports = router;