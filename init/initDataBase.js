const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/StaySpot";
async function main(){
    await mongoose.connect(MONGO_URL);
}
main().then(()=>{
    console.log("Data Base connected");
}).catch((err)=>{
    console.log(err);
});

const initDB = async ()=>{
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj)=>{
        return {...obj,
            owner : [
                ('679dee8296697a79881c5347')
            ]
        }
    });
    await Listing.insertMany(initData.data);
    console.log("Data is initialised");
};

initDB();