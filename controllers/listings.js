const Listing = require("../models/listing");
const User = require("../models/user");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({accessToken: mapToken});


module.exports.index = async (req, res) => {

    const { search, category } = req.query;

    let filter = {};

    if (search && search.trim() !== "") {
        filter.$or = [
            { title: { $regex: search, $options: "i" } },
            { description: { $regex: search, $options: "i" } },
            { location: { $regex: search, $options: "i" } },
            { country: { $regex: search, $options: "i" } },
            { category: { $regex: search, $options: "i" } }
        ];
    }

    if (category && category.trim() !== "") {
        filter.category = category;
    }

    const allListings = await Listing.find(filter);

    res.render("listings/index.ejs", {
        allListings,
        search,
        category
    });

};

module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs");
};

module.exports.showListing = async (req, res) => {

    let { id } = req.params;

    const listing = await Listing.findById(id)
        .populate({
            path: "reviews",
            populate: {
                path: "author",
            },
        })
        .populate("owner");

    if (!listing) {
        req.flash("error", "Listing you requested for does not exist");
        return res.redirect("/listings");
    }

    let isWishlisted = false;

    if (req.user) {

        const user = await User.findById(req.user._id);

        isWishlisted = user.wishlist.includes(listing._id);

    }

    res.render("listings/show.ejs", {
        listing,
        isWishlisted
    });

};

// module.exports.createListing = async (req, res, next) => {
//     let response = await geocodingClient
//     .forwardGeocode({
//         query: req.body.listing.location,
//         limit: 1,
//     })
//     .send();

//     let url = req.file.path;
//     let filename = req.file.filename;
    
//     const newListing = new Listing(req.body.listing);
//     newListing.owner = req.user._id;
//     newListing.image = {url, filename};
//     newListing.geometry = response.body.features[0].geometry;

//     let savedListing = await newListing.save();
//     console.log(savedListing);
//     req.flash("success", "New Listing Created");
//     res.redirect("/listings");
// };

module.exports.createListing = async (req, res, next) => {
    try {
        console.log("========== CREATE LISTING START ==========");

        console.log("Request User:");
        console.log(req.user);

        console.log("Uploaded File:");
        console.log(req.file);

        console.log("Calling Mapbox...");

        let response = await geocodingClient
            .forwardGeocode({
                query: req.body.listing.location,
                limit: 1,
            })
            .send();

        console.log("Mapbox Response:");
        console.log(response.body);

        let url = req.file.path;
        let filename = req.file.filename;

       

        const newListing = new Listing(req.body.listing);

        newListing.owner = req.user._id;
        newListing.image = { url, filename };
        newListing.geometry = response.body.features[0].geometry;

        let savedListing = await newListing.save();

        console.log("Saved Listing:");
        console.log(savedListing);

        console.log("========== CREATE LISTING SUCCESS ==========");

        req.flash("success", "New Listing Created");
        res.redirect("/listings");

    } catch (err) {

        console.log("========== CREATE LISTING ERROR ==========");
        console.log("Error Name:", err.name);
        console.log("Error Message:", err.message);
        console.log("Full Error:");
        console.log(err);
        console.log("Stack:");
        console.log(err.stack);
        console.log("===========================================");

        next(err);
    }
};





module.exports.renderEditForm = async(req, res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);

    if(!listing){
        req.flash("error", "Listing you requested for does not exist");
        return res.redirect("/listings");
    }

    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250");
    res.render("listings/edit.ejs", {listing, originalImageUrl});
};

module.exports.updateListing = async (req, res) => {

    let { id } = req.params;

   

    let listing = await Listing.findByIdAndUpdate(
        id,
        { ...req.body.listing },
        { new: true }
    );

    if (typeof req.file !== "undefined") {

        let url = req.file.path;
        let filename = req.file.filename;

        listing.image = { url, filename };

        await listing.save();
    }

    req.flash("success", "Listing Updated");

    res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async(req, res)=>{
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success", "Listing Deleted");
    res.redirect("/listings");
};