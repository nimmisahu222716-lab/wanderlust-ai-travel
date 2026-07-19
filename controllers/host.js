const User = require("../models/user");
const Listing = require("../models/listing");


module.exports.showHostProfile = async (req, res) => {

    const host = await User.findById(req.params.id);
    console.log(host);

    if (!host) {
        req.flash("error", "Host not found!");
        return res.redirect("/listings");
    }

    const listings = await Listing.find({
        owner: host._id
    });

    res.render("host/show.ejs", {
        host,
        listings,
        listingCount: listings.length
    });

};