if(process.env.NODE_ENV !="production") {

require('dotenv').config();
};
console.log(process.env.SECRET);


const express=require("express");
const app = express();
const mongoose=require("mongoose");
const Listing=require("./models/listing.js");
const path =require("path");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");

const wrapAsync=require("./utils/wrapAsync.js");
const ExpressError=require("./utils/ExpressError.js");
const {listingSchema,reviewSchema}=require("./schema.js");
const Review=require("./models/review.js");
const filtersRouter=require("./routes/filters.js");

const session=require("express-session");
const MongoStore=require("connect-mongo");
const flash=require("connect-flash");

const listingRouter=require("./routes/listing2.js");
const reviewRouter=require("./routes/review2.js");
const userRouter=require("./routes/user2.js");

const passport=require("passport");
const localStrategy=require("passport-local");
const User=require("./models/user.js");


app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

// 
const dbUrl=process.env.ATLASDB_URL;
main().then(()=>{
    console.log("connected to db");
}).catch((err)=>{
    console.log(err);
});
async function main() {
    await mongoose.connect(dbUrl);
  
  };

  
const store=MongoStore.create({
  mongoUrl:dbUrl,
  crypto:{
    secret:process.env.SECRET
  },
  touchAfter:24*3600,
});
store.on("error",()=>{
  console.log("Error in MONGO SESSION STORE",err);
});

const sessionOptions={
  store,
  secret:process.env.SECRET,
  resave:false,
  saveUninitialized:true,
  cookie:{
    httpOnly:true,
    secure:false,
    expires: Date.now() +7*24*60*60*1000,
    maxAge:  7*24*60*60*1000,
},
};


 
  
  app.use(session(sessionOptions));
  app.use(flash());
  

  app.use(passport.initialize());
  app.use(passport.session());

  app.use((req,res,next)=>{
    console.log("Current user:", req.user);
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
     res.locals.currUser=req.user || null;
    next();
  });
  passport.use(new localStrategy(User.authenticate()));

  passport.serializeUser(User.serializeUser());
  passport.deserializeUser(User.deserializeUser());





app.use("/listings",filtersRouter);
  app.use("/listings",listingRouter);
  app.use("/listings/:id/reviews",reviewRouter);
  app.use("/",userRouter);
  










 







app.all("*",(req,res,next)=>{
  next(new ExpressError(404,"Page not found"));
});

app.use((err,req,res,next)=>{
  let{statusCode=505,message="Something Went wrong"}=err;
  res.render("error.ejs",{err});
  
});




app.listen(8080,()=>{
    console.log("listening port");
});