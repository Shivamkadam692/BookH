const mongoose = require('mongoose');
const initData = require('./data.js');
const Listing = require('../models/listing.js');
const CATEGORY_OPTIONS = require('../utils/categoryOptions.js');

const CATEGORY_VALUES = CATEGORY_OPTIONS.map((option) => option.value);

const MONGO_URL = 'mongodb://127.0.0.1:27017/BookH';

main().then(() => {
    console.log('connected to mongoDB');
}).catch((err) => {
    console.log('error connecting to mongoDB', err);
});

async function main() {
    await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj, index) => {
        const category = obj.category && CATEGORY_VALUES.includes(obj.category)
            ? obj.category
            : CATEGORY_VALUES[index % CATEGORY_VALUES.length];

        return {
            ...obj,
            owner: "690dc4de986ee65496e51be0",
            category,
        };
    });

    
    await Listing.insertMany(initData.data);
    console.log("Database initialized with sample data");
}

initDB();