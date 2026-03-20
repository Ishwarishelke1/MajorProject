if(process.env.NODE_ENV != "production"){
    require('dotenv').config();
}

const express=require("express");
const app=express();
const mongoose=require("mongoose");
const path=require("path");
const methodOverride=require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError=require("./utils/ExpressError.js");
const session = require("express-session");
const flash=require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User=require("./models/user.js");

const listingRouter=require("./routes/listing.js"); // getting all route file from listing.js
const reviewRouter=require("./routes/review.js");
const userRouter=require("./routes/user.js");


//const MONGO_URL="mongodb://127.0.0.1:27017/wanderlust2";
const dbUrl=process.env.ATLASDB_URL;

//here we call main Function
main().then(()=>{
    console.log("connected to DB");
}).catch((err)=>{
    console.log(err);
});
async function main(){
    await mongoose.connect(dbUrl);
}

app.set("view engine","ejs");
app.set("views", path.join(__dirname,"views"));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.engine('ejs',ejsMate);
app.use(express.static(path.join(__dirname,"/public")));


const sessionOptions={
    secret:process.env.SECRET, 
    resave:false, saveUninitialized:true,
    cookie:{
        expires:Date.now() +7 * 24*60*60*1000,
        maxAge:7 * 24*60*60*1000,
        httpOnly:true,
    },
};

// app.get("/",(req,res)=>{
//     res.send("hiii");
// });

app.use(session(sessionOptions));
app.use(flash());

//middleware that initialize passport
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
//serialize user into session
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// middleware
app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currUser=req.user;
    next();
});


app.use("/listings",listingRouter);
app.use("/listings/:id/reviews",reviewRouter);
app.use("/",userRouter);

// app.get("/testListing",async(req,res)=>{
//     let sampleListing=new Listing({
//         title:"My new villa",
//         description:"By the beach",
//         price:1200,
//         location:"mumbai",
//         country:"India",

//     });
//     await sampleListing.save();
//     res.send("successfull testing");
// });

//route for all error message
app.get("/", (req, res) => {
    res.send("Home");
});

// 404 handler (must be last)
app.use((req, res, next) => {
    res.status(404).send("Page Not Found");
});
//middleware
app.use((err,req,res,next)=>{
    let {statusCode=500,message="something went wrong"}=err;
    res.render("listings/error.ejs",{message})    //res.status(statusCode).send(message);
});
const port = process.env.PORT || 8080;

app.listen(port, () => {
  console.log(`server is listening to port ${port}`);
});