const express = require("express");
const router = express.Router({mergeParams: true});
const {  reviewSchema} = require('../schema.js');
const ExpressError = require("../utils/ExpressError.js");
const wrapAsync = require("../utils/wrapAsync.js");
const Review = require('../models/review.js');
const Listing = require('../models/listing.js');
//Rewiew 



const validateReview= (req, res, next) => {
    let {error} = reviewSchema.validate(req.body);
    if (error){
        let errorMessage = error.details.map(el => el.message).join(",")
        throw new ExpressError(400, errorMessage);
    }else{
        next();
    }

};


//Review Create route
router.post("/", validateReview, wrapAsync(async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    let review = new Review(req.body.review);
    listing.reviews.push(review);
    await review.save();
    await listing.save();
    res.redirect(`/listings/${listing._id}`);
}));

// Delete Review route
router.delete("/:reviewId", wrapAsync(async (req, res) => {
    let { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/listings/${id}`);
}));

module.exports = router;