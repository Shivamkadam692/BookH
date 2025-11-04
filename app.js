const express = require('express');
const app = express();
const mongoose = require('mongoose');
const Listing = require('./models/listing.js');
const path = require("path");
const methodoverride = require("method-override");
const ejsmate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require ("./utils/ExpressError.js");


const MONGO_URL = 'mongodb://127.0.0.1:27017/BookH';

main().then(() => {
    console.log('connected to mongoDB');
}).catch((err) => {
    console.log('error connecting to mongoDB', err);
});

async function main() {
    await mongoose.connect(MONGO_URL);
}





app.set("views engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended: true}));
app.use(methodoverride("_method"));
app.engine("ejs", ejsmate);
app.use(express.static(path.join(__dirname, "public")));


app.get("/", (req, res) => {
    res.send("iam root");
});
//index route
app.get("/listings", wrapAsync(async (req, res)=>{
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", {allListings});
}));


// new route
app.get("/listings/new", (req, res)=>{
    res.render("listings/new.ejs")
})
//Show route
app.get("/listings/:id", wrapAsync( async(req, res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show.ejs", {listing});
}));

//Create Route
app.post("/listings", wrapAsync (async (req, res, next)=>{
    if(!req.body.listing) throw new ExpressError(400, "send valid Listing Data");
     const newListing = new Listing(req.body.listing);
    await newListing.save()
    res.redirect("/listings");

}));

// edit route
app.get("/listings/:id/edit", wrapAsync(async(req, res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", {listing})
}));

//Update route

app.put("/listings/:id", wrapAsync(async (req, res)=>{
    if(!req.body.listing) throw new ExpressError(400, "send valid Listing Data");
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id, {...req.body.listing});
    res.redirect(`/listings/${id}`);
}));


//Delete route
app.delete("/listings/:id", wrapAsync(async (req, res)=>{
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log("deleted listing:", deletedListing);
    res.redirect("/listings");
}));


// app.get("/testlisting", async (req,res)=> {
//     const sampleListing = new Listing({
//         title: "my new villa",
//         description: "a beautiful villa",
//         price: 2250,
//         location: "nanded",
//         country: "India"
//     });
//     await sampleListing.save();
//     console.log("sample listing saved");
//     res.send("sample listing created");
// })


app.all("*", (req, res, next)=>{
    next(new ExpressError(404, "Page Not Found!"));
});

app.use((err, req, res, next) => {
    let {statusCode=500, message="Somthing Went Wrong!"} =err;
    res.status(statusCode).render("error.ejs", {message});
    // res.status(statusCode).send(message);
});


app.listen(8080, () => {
    console.log('server listening to port 8080');
});