const Listing = require('../models/listing.js');
const Booking = require('../models/booking.js');
const ExpressError = require('../utils/ExpressError.js');

const MS_PER_DAY = 1000 * 60 * 60 * 24;

const calculateNights = (checkIn, checkOut) => {
  const diff = checkOut - checkIn;
  return Math.ceil(diff / MS_PER_DAY);
};

module.exports.createBooking = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);

  if (!listing) {
    throw new ExpressError(404, 'Listing not found');
  }

  if (listing.owner.equals(req.user._id)) {
    req.flash('error', 'You cannot book your own listing.');
    return res.redirect(`/listings/${id}`);
  }

  const { checkIn, checkOut, guests, notes } = req.body.booking;

  const startDate = new Date(checkIn);
  const endDate = new Date(checkOut);
  const nights = calculateNights(startDate, endDate);

  if (!Number.isFinite(nights) || nights <= 0) {
    req.flash('error', 'Please select valid check-in and check-out dates.');
    return res.redirect(`/listings/${id}`);
  }

  const totalPrice = nights * listing.price;

  const booking = new Booking({
    listing: listing._id,
    guest: req.user._id,
    checkIn: startDate,
    checkOut: endDate,
    guests: Number(guests),
    notes: notes ? notes.trim() : undefined,
    totalPrice,
  });

  await booking.save();
  listing.bookings.push(booking._id);
  await listing.save();

  req.flash('success', `Booking confirmed for ${nights} night(s)!`);
  res.redirect(`/listings/${id}`);
};

module.exports.cancelBooking = async (req, res) => {
  const { id, bookingId } = req.params;
  const booking = await Booking.findById(bookingId).populate('guest').populate('listing');

  if (!booking) {
    req.flash('error', 'Booking not found.');
    return res.redirect(`/listings/${id}`);
  }

  const isOwner = booking.listing.owner.equals(req.user._id);
  const isGuest = booking.guest._id.equals(req.user._id);

  if (!isOwner && !isGuest) {
    req.flash('error', 'You do not have permission to modify this booking.');
    return res.redirect(`/listings/${id}`);
  }

  booking.status = 'cancelled';
  await booking.save();

  req.flash('success', 'Booking cancelled.');
  res.redirect(isGuest ? '/dashboard' : `/listings/${id}`);
};

