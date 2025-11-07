const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require("path");
const methodoverride = require("method-override");
const ejsmate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const  listings = require('./routes/listing.js');
const reviews = require('./routes/review.js');
const session = require('express-session');
const flash = require('connect-flash');


const MONGO_URL = 'mongodb://127.0.0.1:27017/BookH';

main().then(() => {
    console.log('connected to mongoDB');
}).catch((err) => {
    console.log('error connecting to mongoDB', err);
});

async function main() {
    await mongoose.connect(MONGO_URL);
}




app.engine("ejs", ejsmate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodoverride("_method"));
app.use(express.static(path.join(__dirname, "public")));



const sessionConfig = {
    secret: 'thisshouldbeabettersecret!',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }    
}

app.use(session(sessionConfig));
app.use(flash());

app.get("/", (req, res) => {
    res.send("iam root");
});


app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
});


//Routers 
app.use('/listings', listings);
app.use('/listings/:id/reviews', reviews);



// Error handling routes
app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page Not Found!"));
});

app.use((err, req, res, next) => {
    let { statusCode = 500, message = "Somthing Went Wrong!" } = err;
    res.status(statusCode).render("error.ejs", { message });
    // res.status(statusCode).send(message);
});


app.listen(8080, () => {
    console.log('server listening to port 8080');
});