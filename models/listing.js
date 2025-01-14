const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const defaultImage = "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

const listingSchema = new Schema({
    title : {
        type : String,
        required : true,
    },
    description : String,
    image : {
        type : String,
        default : defaultImage,
        set : (img) => img === "" ? defaultImage : img, 
    },
    price : Number,
    location : String,
    country : String,
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;

