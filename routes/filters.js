const Listing=require("../models/listing");
const express=require("express");
const wrapAsync=require("../utils/wrapAsync.js");
const router=express.Router();


router.get("/rooms",async (req,res)=>{
    let filtering=await Listing.find({category:"Rooms"});
    res.render("listschemafol/filter.ejs",{filtering});

});
router.get("/bed",async (req,res)=>{
    let filtering=await Listing.find({category:"Bed"});
    res.render("listschemafol/filter.ejs",{filtering});

});
router.get("/arcticpool",async (req,res)=>{
    let filtering=await Listing.find({category:"Arctic Pool"});
    res.render("listschemafol/filter.ejs",{filtering});

});
router.get("/camping",async (req,res)=>{
    let filtering=await Listing.find({category:"Camping"});
    res.render("listschemafol/filter.ejs",{filtering});

});
router.get("/farms",async (req,res)=>{
    let filtering=await Listing.find({category:"Farms"});
    res.render("listschemafol/filter.ejs",{filtering});

});
router.get("/treehouse",async (req,res)=>{
    let filtering=await Listing.find({category:"TreeHouse"});
    res.render("listschemafol/filter.ejs",{filtering});

});
router.get("/tropical",async (req,res)=>{
    let filtering=await Listing.find({category:"Tropical"});
    res.render("listschemafol/filter.ejs",{filtering});

});
router.get("/trending",async (req,res)=>{
    let filtering=await Listing.find({category:"Trending"});
    res.render("listschemafol/filter.ejs",{filtering});

});
router.get("/iconiccities",async (req,res)=>{
    let filtering=await Listing.find({category:"Iconic Cities"});
    res.render("listschemafol/filter.ejs",{filtering});

});


module.exports=router;
