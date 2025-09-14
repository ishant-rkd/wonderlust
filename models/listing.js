const mongoose = require('mongoose');
const Schema=mongoose.Schema;
const review = require("./review.js");

const ListingSchema=new Schema({
    title:{
        type:String,
        require:true
    },
    description:String,
    image: {
        filename: {
            type: String,
            default: "listingimage"
        },
        url: {
            type: String,
            default: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
            set: (v) => {
                if (!v || v.trim() === "") {
                    return "https://images.unsplash.com/photo-1507525428034-b723cf961d3e";
                }
                return v;
            }
        }
    },
    price:Number,
    location:String,
    country:String,
    reviews:[
        {
            type:Schema.Types.ObjectId,
            ref:"Review"
        },
    ],
})

ListingSchema.post("findOneAndDelete",async(listing)=>{
    if(listing){
        await review.deleteMany({_id:{$in:listing.reviews}});
    }
});
const Listing =mongoose.model("Listing",ListingSchema);
module.exports=Listing;