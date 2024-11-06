const express=require("express");
const router  =express.Router({mergeParams:true});
const Review=require("../models/review.js");
const {listingSchema,reviewSchema}=require("../schema.js");
const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/ExpressError.js");
const Listing=require("../models/listing.js");
const {isLoggedIn,isReviewAuthor}=require("../middleware.js");


const validateReview=(req,res,next) => {
  console.log("Request Body:",req.body);
    let{error}=reviewSchema.validate(req.body);
    if(error){
      console.error("Validation Error:",error.details);
      throw new ExpressError(400,error.details.map(e=>e.message).join(','));
    }
    else{
      next();
    }
  };


  //POST ROUTE 
// isme phele to post request li h 
//phir id ko require kiya h 
router.post("/",isLoggedIn,validateReview, wrapAsync(async(req,res)=>{
    let {id}=req.params;
    let revList= await Listing.findById(id);//listing ko access karne ke liye review wale me
    
    let newReview=new Review(req.body.review);
    newReview.author=req.user._id;
    
    //naya review create karne ke liye or usme review jisme rating or coomment h uskon pss kr denge
    revList.reviews.push(newReview);//revList naam se humne us listing ko liya jo id se find ki thi 
  //revList ek koi listing h jiske andar humne reviews naam ki array banai h uske andar hum newreview ko push kara rahe h 
  //kyoki har listing ke pass ab review hoga jisme hum review ko add kr rahe h bs
    await newReview.save();//database ke andar save kr denge
    await revList.save();//database ke andar save kr denge
    req.flash("success","New Review Created");
    //console.log("new review saved");
    //res.send("new review saved");
    res.redirect(`/listings/${revList._id}`);
  }));
  //Delete Review Route
  router.delete("/:reviewId",isLoggedIn,isReviewAuthor,wrapAsync(async(req,res)=>{
        let {id,reviewId}=req.params;
  
        await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
  //upar wale ka matlab ye h ki phele listing ke andar find kia id se or jo bhi review array se reviewId match kr jaye use pull mtlb remove kr de or update ho jaye
        await Review.findByIdAndDelete(reviewId);
        req.flash("success","Review  Deleted");
        res.redirect(`/listings/${id}`);
  }));

  module.exports=router;
  