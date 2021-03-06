const express = require("express");
const router = express.Router();

const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

const Offer = require("../models/Offer.js");

/// route offers
router.get("/offers", async (req, res) => {
  console.log("offers route");
  const filteredObject = {};

  try {
    if (req.query.title) {
      filteredObject.product_name = new RegExp(req.query.title, "i");
    }

    if (req.query.priceMin) {
      filteredObject.product_price = { $gte: req.query.priceMin };
    }

    if (req.query.priceMax) {
      if (filteredObject.product_price) {
        filteredObject.product_price.$lte = req.query.priceMax;
      } else {
        filteredObject.product_price = { $lte: req.query.priceMax };
      }
    }

    // Correction - gesstion du sort
    const sortObject = {};
    if (req.query.sort === "price-desc") {
      sortObject.product_price = "desc";
    } else if (req.query.sort === "price-asc") {
      sortObject.product_price = "asc";
    }

    const offers = await Offer.find(filteredObject)
      .sort(sortObject)
      .skip((req.query.page - 1) * req.query.limit)
      .limit(req.query.limit)
      .select(
        "product_details product_pictures _id product_name product_description product_price owner"
      );

    const count = await Offer.countDocuments(filteredObject);

    res.json({ count: count, offers: offers });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

/// Route offer
router.get("/offer/:id", async (req, res) => {
  console.log("OFFER route");
  console.log(req.params);
  try {
    const offerToShow = await Offer.findById(req.params.id).populate({
      path: "owner",
      select: "account.username email -_id",
    });
    res.json(offerToShow);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
