const express = require("express");
const router=express.Router();
const wrapAsync=require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner, validateListing }=require("../middleware.js");
 const ListingController=require("../controllers/listings.js");
const multer=require("multer");
const {storage}=require("../cloudConfig.js")
const upload=multer({storage});


 //combine the same route path 
router
.route("/")
.get(wrapAsync(ListingController.index))//index route
.post(isLoggedIn,upload.single('listing[image]'),validateListing, wrapAsync(ListingController.createListing));//create route


// new form route to add new listings
router.get("/new",isLoggedIn,ListingController.renderNewForm);

router.get("/search", async (req, res) => {
    let { query } = req.query;

    if (!query) {
        return res.redirect("/listings");
    }

    const listings = await Listing.find({
        $or: [
            { location: { $regex: query, $options: "i" } },
            { country: { $regex: query, $options: "i" } }
        ]
    });

    res.render("listings/index", { allListings: listings, category: null });
});


router.route("/:id")
.get(wrapAsync(ListingController.showListing)) //show route
.put( isLoggedIn, isOwner,upload.single('listing[image]'),validateListing,wrapAsync(ListingController.updateListing)) //updateroute
.delete(isLoggedIn,isOwner,wrapAsync(ListingController.destroyListing)); //delete routes


//edit route
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(ListingController.renderEditForm));



module.exports=router;