const { model } = require("mongoose");
const Listing = require("../models/listing.js");
const CATEGORY_OPTIONS = require("../utils/categoryOptions.js");

const CATEGORY_VALUES = CATEGORY_OPTIONS.map((option) => option.value);

const buildSearchClause = (searchTerm) => {
  if (!searchTerm) {
    return null;
  }
  const trimmed = searchTerm.trim();
  if (!trimmed) {
    return null;
  }
  const regex = new RegExp(trimmed.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
  return {
    $or: [
      { title: regex },
      { description: regex },
      { location: regex },
      { country: regex },
      { category: regex },
    ],
  };
};

module.exports.index = async (req, res) => {
  const { category, search } = req.query;
  const filters = [];

  const isValidCategory = category && CATEGORY_VALUES.includes(category);
  if (isValidCategory) {
    filters.push({ category });
  }

  const searchClause = buildSearchClause(search);
  if (searchClause) {
    filters.push(searchClause);
  }

  const query = filters.length ? { $and: filters } : {};

  const allListings = await Listing.find(query);
  res.render("listings/index.ejs", {
    allListings,
    categoryOptions: CATEGORY_OPTIONS,
    activeCategory: isValidCategory ? category : "All",
    searchTerm: search ? search.trim() : "",
    resultCount: allListings.length,
  });
};

module.exports.newForm = (req, res) => {

  res.render("listings/new.ejs", {
    categoryOptions: CATEGORY_OPTIONS,
  })
};

module.exports.showListings = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id)
    .populate("owner")
    .populate({
      path: "reviews",
      populate: { path: "author" },
    })
    .populate({
      path: "bookings",
      match: { status: "confirmed" },
      options: { sort: { checkIn: 1 } },
      populate: { path: "guest", select: "username email" },
    });
  if (!listing) {
    req.flash('error', 'Cannot find that listing!');
    return res.redirect('/listings');
  }

  const now = new Date();
  const upcomingBookings = (listing.bookings || []).filter(
    (booking) => booking.checkOut >= now
  );
  const isOwner = req.user ? listing.owner._id.equals(req.user._id) : false;
  const myUpcomingBookings = req.user
    ? upcomingBookings.filter(
        (booking) => booking.guest && booking.guest._id.equals(req.user._id)
      )
    : [];

  res.render("listings/show.ejs", {
    listing,
    categoryOptions: CATEGORY_OPTIONS,
    upcomingBookings,
    isOwner,
    myUpcomingBookings,
  });
};


module.exports.createListing = async (req, res, next) => {
  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;
  if (req.file) {
    const url = req.file.path;
    const filename = req.file.filename;
  newListing.image = { url, filename };
  }
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
  res.render("listings/edit.ejs", {
    listing,
    orgImg,
    categoryOptions: CATEGORY_OPTIONS,
  })
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