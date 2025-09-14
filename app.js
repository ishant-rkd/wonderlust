require('dotenv').config({ path: './config.env' });
const express= require("express");
const app = express();
const mongoose = require('mongoose');
const Listing=require("./models/listing.js");
const path= require("path");
const methodOverride=require("method-override");
const ejsMate = require('ejs-mate');
const wrapAsync =require("./utlity/wrapAsync.js");
const ExpressError =require("./utlity/ExpressError.js");0
const {listingSchema,reviewSchema} = require("./schema.js");
const Review=require("./models/review.js");
const review = require("./models/review.js");


const MONGO_URL="mongodb://127.0.0.1:27017/wenderlust"
main().then(()=>{
    console.log("server is listning to db");
})
.catch(err => console.log(err));
async function main() {
  await mongoose.connect(MONGO_URL);
}
//sample testing
/*app.get("/testlisting",async(req,res)=>{
    let sampleListing= new Listing({
        title:"my new villa",
        descdescription:"whit the sea facing ,you can see wanderfull sunset",
        price:1200,
        location:"Matunga ,andamon",
        country:"India",
    });
    await sampleListing.save();
    console.log("sample was saved");
    res.send("test successfull");
})*/
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

const validatelisting=(req,res,next)=>{
    let {error}=listingSchema.validate(req.body);
    console.log(error);
    if(error){
        let errMsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg);
    }else{
        next();
    }
}

const validatereview=(req,res,next)=>{
    let {error}=reviewSchema.validate(req.body);
    console.log(error);
    if(error){
        let errMsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg);
    }else{
        next();
    }
}

//index rout
app.get("/listing",wrapAsync(async(req,res)=>{
    const allListing= await Listing.find({});
    res.render("listing/index.ejs",{allListing});
})
);

//new listing rout
app.get("/listing/new",wrapAsync(async(req,res)=>{
    res.render("listing/new.ejs");
})
);

//show rout
app.get("/listing/:id",wrapAsync(async(req,res)=>{
    let {id}=req.params;
    const listing= await Listing.findById(id).populate("reviews");
    res.render("listing/show.ejs",{listing});
})
);

//creat rout
app.post("/listing",validatelisting,wrapAsync(async(req,res)=>{
    const newListing=new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listing");
})
);

//edit rout
app.get("/listing/:id/edit",wrapAsync(async(req,res)=>{
    let {id}=req.params;
    const listing= await Listing.findById(id);
    res.render("listing/edit.ejs",{listing});
})
);
//update rout
app.put("/listing/:id",validatelisting,wrapAsync(async(req,res)=>{
    let {id}=req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    res.redirect(`/listing/${id}`);
})
);
//delete rout
app.delete("/listing/:id",wrapAsync(async(req,res)=>{
    let {id}=req.params;
    const deleteListing=await Listing.findByIdAndDelete(id);
    console.log(deleteListing);
    res.redirect("/listing");
})
);
//review rout
app.post("/listing/:id/reviews",validatereview,wrapAsync(async(req,res)=>{
    let listing= await Listing.findById(req.params.id);
    let newReview= new Review(req.body.review);

    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();

    res.redirect(`/listing/${listing._id}`); 
}));

//Delete review rout
app.delete("/listing/:id/reviews/:reviewId",wrapAsync(async(req,res)=>{
    let {id,reviewId}=req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);

    res.redirect(`/listing/${id}`);
}));

app.get("/",(req,res)=>{
    res.send("hi, i am root")
});
//app.all("*",(req,res,next)=>{
   // next(new ExpressError(404,"page not found!!"));
//});

app.use((err,req,res,next)=>{
     let { status = 500, message = "Something went wrong" } = err;
    res.status(status).render("error.ejs",{message});
});

const port = process.env.PORT || 8080;

app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});