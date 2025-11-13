const Listing = require('../models/listing.js');
const Booking = require('../models/booking.js');

module.exports.overview = async (req, res) => {
  const ownerId = req.user._id;

  const ownerListings = await Listing.find({ owner: ownerId })
    .populate({
      path: 'bookings',
      match: { status: 'confirmed' },
      populate: { path: 'guest', select: 'username email' },
    })
    .sort({ createdAt: -1 });

  const now = new Date();
  ownerListings.forEach((listing) => {
    listing.upcomingBookings = listing.bookings.filter(
      (booking) => booking.checkOut >= now
    );
  });

  const listingIds = ownerListings.map((listing) => listing._id);

  const incomingBookings = listingIds.length
    ? await Booking.find({
        listing: { $in: listingIds },
        status: 'confirmed',
        checkOut: { $gte: new Date() },
      })
        .populate('listing', 'title location country image')
        .populate('guest', 'username email')
        .sort({ checkIn: 1 })
    : [];

  const myBookings = await Booking.find({
    guest: ownerId,
    status: 'confirmed',
    checkOut: { $gte: new Date() },
  })
    .populate('listing', 'title location country image price owner')
    .populate({
      path: 'listing',
      populate: { path: 'owner', select: 'username' },
    })
    .sort({ checkIn: 1 });

  res.render('dashboard/index.ejs', {
    ownerListings,
    incomingBookings,
    myBookings,
  });
};

