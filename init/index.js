const mongoose=require("mongoose");
const initData=require("./data.js");
const Listing = require("../models/listing.js");
const User = require("../models/user.js");
const MONGO_URL="mongodb://127.0.0.1:27017/wanderlust2";

//here we call main Function
main().then(()=>{
    console.log("connected to DB");
}).catch((err)=>{
    console.log(err);
});
async function main(){
    await mongoose.connect(MONGO_URL);
}

const initDB=async()=>{
    //clean random data
    await Listing.deleteMany({});
    //find user
    //const user = await User.findOne({ username: "ovee" });
    // add owner to listings
    initData.data = initData.data.map((obj) => ({
        ...obj,
        owner: "69aaceea2261d5fea3eb4116"
    }));
    //insert our data
    await Listing.insertMany(initData.data);
    console.log("data was initialide");

};
initDB();