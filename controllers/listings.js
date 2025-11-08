const { model } = require("mongoose");
const Listing = require("../models/listing.js")


module.exports.index = async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
};

module.exports.newForm = (req, res) => {

  res.render("listings/new.ejs")
};

module.exports.showListings = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id)
    .populate("owner")
    .populate({
      path: "reviews",
      populate: { path: "author" },
    });
  if (!listing) {
    req.flash('error', 'Cannot find that listing!');
    return res.redirect('/listings');
  }
  res.render("listings/show.ejs", { listing });
};


module.exports.createListing = async (req, res, next) => {
  let url = req.file.path;
  let filename = req.file.filename;
  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;
  newListing.image = { url, filename };
  await newListing.save()
  req.flash('success', 'Successfully made a new listing!');
  res.redirect("/listings");

};


module.exports.editForm = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash('error', 'Cannot find that listing!');
    return res.redirect('/listings');
  }

  let orgImg = listing.image.url;
  orgImg = orgImg.replace("/upload", "/upload/w_250");
  res.render("listings/edit.ejs", { listing , orgImg})
};

module.exports.updateForm = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  if(typeof req.file !== "undefined"){
  let url = req.file.path;
  let filename = req.file.filename;
 listing.image = { url, filename };
 await listing.save();
  }
  req.flash('success', 'Updated Listing!');
  res.redirect(`/listings/${id}`);
};

module.exports.deletelisting = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deletedListing = await Listing.findByIdAndDelete(id);
    console.log("deleted listing:", deletedListing);

    if (!deletedListing) {
      req.flash("error", "Listing not found");
      return res.redirect("/listings");
    }

    req.flash("success", "Listing deleted successfully");
    return res.redirect("/listings"); // ✅ only one response
  } catch (err) {
    next(err);
  }

};