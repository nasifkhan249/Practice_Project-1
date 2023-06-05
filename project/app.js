//Basic Lib Import
const { readdirSync } = require("fs");
const express = require("express");
const router = require("./scr/routes/api");
const app = express();
require("dotenv").config();



//Security Middleware Lib Import
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize= require("express-mongo-sanitize");
const hpp = require("hpp");
const cors = require("cors");

//Database Lib Import
const mongoose = require("mongoose");


//Security Middleware Implement
app.use(cors());
app.use(helmet());
app.use(mongoSanitize());
app.use(hpp());


// Express from require json
app.use(express.json());



//Request Rate Limit
const limiter = rateLimit({windowMs:15*60*1000,max:3000});
app.use(limiter);

//Mongo DB Database Connection

let option = {user:'',pass:''};
mongoose
    .connect(process.env.DATABASE,option)
    .then(()=>{
        console.log("Connection Success");
    })
    .catch((err) => console.log(err));

    //Routing Implement
    readdirSync("./scr/routes").map(r=>app.use("/api/v1",require(`./scr/routes/${r}`)));

    //Undefined Route Implement

    app.use("*",(req,res)=>{
        res.status(404).json({status:"fail",data:"Not Found"});
    });


    module.exports=app;