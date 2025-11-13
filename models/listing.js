const mongoose = require('mongoose');
const review = require('./review.js');
const Booking = require('./booking.js');
const CATEGORY_OPTIONS = require('../utils/categoryOptions.js');
const Schema = mongoose.Schema;

const CATEGORY_VALUES = CATEGORY_OPTIONS.map((option) => option.value);

const listingSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  description: String,
  image: {
    filename: {
      type: String,
      default: 'listingimage'
    },
    url: {
      type: String,
      default: 'https://wallpapers.com/images/featured/most-beautiful-nature-hdb30wtkjbn08xlf.jpg',
      set: v => v === '' ? 'https://wallpapers.com/images/featured/most-beautiful-nature-hdb30wtkjbn08xlf.jpg' : v
    }
  },
  price: Number,
  location: String,
  country: String,
  category: {
    type: String,
    enum: CATEGORY_VALUES,
    required: true,
    default: CATEGORY_VALUES[0],
  },
  reviews: [{
      type: Schema.Types.ObjectId,
      ref: 'Review',
  },],
  bookings: [{
      type: Schema.Types.ObjectId,
      ref: 'Booking',
  },],
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
});


listingSchema.post('findOneAndDelete', async (listing) => {
  if (listing){
    await review.deleteMany({
      _id: {
        $in: listing.reviews
      }
    });
    await Booking.deleteMany({
      _id: {
        $in: listing.bookings,
      },
    });
  }
});


const Listing = mongoose.model('Listing', listingSchema);  
module.exports = Listing;