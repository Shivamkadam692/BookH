const mongoose = require('mongoose');
const review = require('./review.js');
const Schema = mongoose.Schema;

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
  reviews: [{
      type: Schema.Types.ObjectId,
      ref: 'Review',
  },]
});


listingSchema.post('findOneAndDelete', async (listing) => {
  if (listing){
    await review.deleteMany({
      _id: {
        $in: listing.reviews
      }
    });
  }
});


const Listing = mongoose.model('Listing', listingSchema);  
module.exports = Listing;