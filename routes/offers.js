const express = require("express");    
const router = express.Router();

const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: "dnhmaqdjr",
  api_key: "445914567143873",
  api_secret: "B62VWHY9Gq6Lr0FEfY8BQEx79Cc"
});


const Offer = require("../models/Offer.js");

const isAuthenticated = require("../middlewares/isAuthenticated");

///
router.get("/offers", isAuthenticated, async (req,res) => {
    

    // Corretion - Gestion de la pagination


// ---------------------------------------------------------------------
            // if (req.query.page) {
            //     const pageLimit = 2;
            //     const offers = await Offer.find().limit(pageLimit).skip((Number(req.query.page) - 1) * pageLimit);
            //     res.json(offers);
            // } else if (req.query.title && req.query.priceMax && req.query.priceMin) {
            //     const offers = await Offer.find({
            //         product_name: new RegExp(req.query.title,"i"),
            //         product_price: {$lte: req.query.priceMax, $gte: req.query.priceMin}
            //     });
            //     res.json(offers);
            // } else if (req.query.priceMax && req.query.priceMin) {
            //     const offers = await Offer.find({
            //         product_price: {$lte: req.query.priceMax, $gte: req.query.priceMin}
            //     });
            //     res.json(offers);
            // } else if (String(req.query.sort) === "price-desc") {
            //     const offers = await Offer.find().sort({product_price: -1});
            //     res.json(offers);
            // } else if (String(req.query.sort) === "price-asc" && req.query.title) {
            //     const offers = await Offer
            //         .find({product_name: new RegExp(req.query.title,"i")})
            //         .sort({product_price: 1});
            //     res.json(offers);
            // } else if (String(req.query.sort) === "price-asc") {
            //     const offers = await Offer.find().sort({product_price: 1});
            //     res.json(offers);
            // } else { 
            //     const offers = await Offer.find({
            //         product_name: new RegExp(req.query.title,"i"),
            //     });
            //     res.json(offers);
            // };
//-------------------------------------------------------------------------
        
console.log("offers route");
const filteredObject = {};   // Correction

// Correction - gestion du find
try{

    if(req.query.title) {
        filteredObject.product_name = new RegExp(req.query.title, "i");
    }

    if(req.query.priceMin) {
        filteredObject.product_price = {$gte: req.query.priceMin};
    }

    if(req.query.priceMax) {
        if(filteredObject.product_price) {
            filteredObject.product_price.$lte = req.query.priceMax;
        } else {
            filteredObject.product_price = {$lte: req.query.priceMax};
        }
    }

// Correction - gesstion du sort
    const sortObject = {};
    if(req.query.sort === "price-desc") {
        sortObject.product_price = "desc";
    } else if (req.query.sort === "price-asc") {
        sortObject.product_price = "asc";
    }

        // let limit = 2;
        // if(req.query.limit) {
        //     limit = req.query.limit;
        // }
       
        // let page = 1;
        // if(req.query.page) {
        //     page = req.query.page;
        // }


        const offers = await Offer
            .find(filteredObject)
            .sort(sortObject)
            .skip((req.query.page - 1) * req.query.limit)
            .limit(req.query.limit)
            .select("product_name product_price")
        
        const count = await Offer.countDocuments(filteredObject);


        res.json({count: count, offers: offers});
        
        /// correction

    } catch (error) {
        res.status(400).json({ error: error.message });
    };
});


router.get("/offer/:id", isAuthenticated, async (req,res) => {
    console.log("OFFER route");
    console.log(req.params);
    try {

    const offerToShow = await Offer.findById(req.params.id).populate({
        path: "owner",
        select: "account.username email -_id"
    });
    res.json(offerToShow);

    } catch (error) {
    res.status(400).json({ error: error.message });
    };
});


module.exports = router;