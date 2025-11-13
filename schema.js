const joi = require('joi');
const CATEGORY_OPTIONS = require('./utils/categoryOptions.js');

const CATEGORY_VALUES = CATEGORY_OPTIONS.map((option) => option.value);

module.exports.listingSchema = joi.object({
    listing: joi.object({
        title: joi.string().required(),
        description: joi.string().required(),
        location: joi.string().required(),
        country: joi.string().required(),
        price: joi.number().required().min(0),
        category: joi.string().valid(...CATEGORY_VALUES).required(),
        image: joi.string().allow("", null)
    }).required(),
});


module.exports.reviewSchema= joi.object({
    review : joi.object({
        rating : joi.number().required().min(1).max(5),
        comment : joi.string().required()
    }).required(),
});

module.exports.bookingSchema = joi.object({
    booking: joi.object({
        checkIn: joi.date().iso().required(),
        checkOut: joi.date().iso().greater(joi.ref('checkIn')).required(),
        guests: joi.number().integer().min(1).max(12).required(),
        notes: joi.string().allow('', null).max(500),
    }).required(),
});