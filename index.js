require('dotenv').config();
const express = require("express");
const formidable = require("express-formidable");
const mongoose = require("mongoose");
const morgan = require("morgan");
const cors = require("cors");


const app = express();
app.use(formidable());
app.use(morgan("tiny"));
app.use(cors());

<<<<<<< HEAD
mongoose.connect(process.env.MONGODB_URI);
=======
mongoose.connect("mongodb+srv://joeyindaclouds:qvn5AuEmefU@cluster0.rotgl.mongodb.net/test"); 
>>>>>>> ea33cd3c062cab14bfbbb967235e6db579be9af7

const signUp = require("./routes/signup");
app.use(signUp);

const login = require("./routes/login");
app.use(login);

const publish = require("./routes/publish");
app.use(publish);

const offers = require("./routes/offers");
app.use(offers);


app.all("*", (req, res) => {
    console.log("all routes");
    res.status(400).json({message: "Unauthorized"});
    
 });


app.listen(process.env.PORT, () => {console.log("Server started")});

/// Test commit