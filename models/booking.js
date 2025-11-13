const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bookingSchema = new Schema(
  {
    listing: {
      type: Schema.Types.ObjectId,
      ref: 'Listing',
      required: true,
    },
    guest: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    checkIn: {
      type: Date,
      required: true,
    },
    checkOut: {
      type: Date,
      required: true,
    },
    guests: {
      type: Number,
      min: 1,
      default: 1,
    },
    totalPrice: {
      type: Number,
      min: 0,
    },
    notes: {
      type: String,
      maxlength: 500,
    },
    status: {
      type: String,
      enum: ['confirmed', 'cancelled'],
      default: 'confirmed',
    },
  },
  {
    timestamps: true,
  }
);

bookingSchema.virtual('nights').get(function nights() {
  const MS_PER_DAY = 1000 * 60 * 60 * 24;
  const diff = this.checkOut - this.checkIn;
  return diff > 0 ? Math.ceil(diff / MS_PER_DAY) : 0;
});

const Booking = mongoose.model('Booking', bookingSchema);
module.exports = Booking;

