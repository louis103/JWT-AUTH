const dotenv = require("dotenv");
require("./config/database").connect();
const bodyParser = require("body-parser");
dotenv.config({ path: './config/config.env' });
const User = require("./model/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const helmet = require("helmet");
const cors = require("cors");
const morgan = require("morgan");
const auth = require("./middleware/auth");

const express = require("express");

const app = express();
app.use(express.json());//enable json in server

app.use(helmet());
app.use(cors());
app.use(morgan("common"));

//handling routes
//register new user
app.post("/register", async (req,res) => {
    try {
        //register logic goes here
        const { first_name, last_name, email,password } = req.body;
        if(!(first_name&&last_name&&email&&password)){
            res.status(400).send("All inputs are required!");
            return;
        }
        //assuming everything worked
        const oldUser = await User.findOne({ email });
        if(oldUser){
            return res.status(409).send("User already exists.Please Login.");
            return;
        }

        //gen user salt
        const salt = await bcrypt.genSalt(10);
        encryptedPassword = await bcrypt.hash(password,salt);
        //create a user
        const user = await User.create({
            first_name,
            last_name,
            email: email.toLowerCase(),
            password:encryptedPassword,//create a hashed password
        });

        //generate a token
        const token = jwt.sign(
            {
                user_id:user._id,
                email
            },
                process.env.TOKEN_KEY,
            { 
                expiresIn: "2h"
            },
        );
        //save user token
        user.token = token;
        //return new user
        await user.save();
        res.status(201).json(user);
    } catch (error) {
        console.log(error);
        res.sendStatus(500).json({ error: error });
    }
    //register logic ends there
});

//login user with credentials
app.post("/login", async (req,res) => {
    try {
        const { email,password } = req.body;
        if(!(email&&password)){
            res.status(400).send("All Inputs are required!");
            return;
        }
        //validate if user exists in database
        const user = await User.findOne({ email });
        if(user && (await bcrypt.compare(password,user.password))){
            const token = jwt.sign(
                {
                    user_id:user._id,
                    email
                },
                process.env.TOKEN_KEY,
                {
                    expiresIn:"2h",
                }
            );
            //save a user token
            user.token=token;
            await user.save();
            //return the logged in user
            return res.status(200).json(user);
        }
        res.status(400).send("Invalid Credentials");
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error });
    }
    //our login goes there
});
//welcome
app.post("/welcome",auth,(req,res) => {
    res.status(200).send("Welcome to our app, hurray!!!");
});



module.exports = app;