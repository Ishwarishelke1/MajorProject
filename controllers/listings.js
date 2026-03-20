const Listing = require("../models/listing.js");
//callback fun for indext route from the route folder-listings.js

module.exports.index= async(req,res)=>{
    const allListings=await Listing.find({});
    res.render("listings/index",{allListings});
};

module.exports.renderNewForm=(req,res)=>{
    res.render("listings/new.ejs");
};

module.exports.showListing=async(req,res)=>{
    const {id}=req.params;
    const listing=await Listing.findById(id)
    .populate({
        path:"reviews",
        populate:{
            path:"author",
        },
    })
    .populate("owner");
    if(!listing){
        req.flash("error","Listing does not exits ");
        return res.redirect("/listings");
    }
    res.render("listings/show",{ listing });

};

module.exports.createListing=async (req, res) => {
    let url = req.file.path;
    let filename = req.file.filename;
    
    let listingData = req.body.listing;
    listingData.image = {
        filename: "listingimage",
        url: listingData.image || "https://images.unsplash.com/photo-1578645510447-e20b4311e3ce?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDF8fGNhbXBpbmd8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60"
    };

    const newListing = new Listing(listingData);

    newListing.owner = req.user._id;   // ⭐ important
    newListing.image = {url, filename};
    await newListing.save();
    console.log(newListing.owner);
    req.flash("success","New listing created ");
    res.redirect("/listings");

};

module.exports.renderEditForm=async(req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id);
    if(!listing){
        req.flash("error","Listing does not exits ");
        return res.redirect("/listings");
    }

    let originalImageUrl=listing.image.url;
    originalImageUrl=originalImageUrl.replace("/upload","/upload/h_300,w_250");

    res.render("listings/edit.ejs", {listing, originalImageUrl });
};

module.exports.updateListing=async (req, res) => {
    let { id } = req.params;
    
    let updatedData = req.body.listing;

    // // convert image string to object
    // updatedData.image = {
    //     filename: "listingimage",
    //     url: updatedData.image
    // };

    let listing= await Listing.findByIdAndUpdate(id, updatedData);

    if(typeof req.file !== "undefined"){
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image={url,filename};
        await listing.save();
    };

    req.flash("success", "listing updated");
    res.redirect(`/listings/${id}`);
};

module.exports.destroyListing=async(req,res)=>{
    let {id}=req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success"," listing deleted");
    res.redirect("/listings");
};


