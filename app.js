const express = require('express');
const app = express();
const mongoose = require('mongoose');

const MONGO_URL = 'mongodb://127.0.0.1:27017/BookH';

main().then(() => {
    console.log('connected to mongoDB');
}).catch((err) => {
    console.log('error connecting to mongoDB', err);
});

async function main() {
    await mongoose.connect(MONGO_URL);
}

app.get("/", (req, res) => {
    res.send("iam root");
});


app.listen(8080, () => {
    console.log('server listening to port 8080');
});