const mongoose = require("mongoose");
const dotenv = require("dotenv");
//init dotenv
dotenv.config({ path: './config/config.env' });

const { MONGO_URI } = process.env;

exports.connect = () => {
    mongoose.connect(MONGO_URI).then(() => {
        console.log("Successfully connected to mongodb database");
    })
    .catch((err) => {
        console.log("Database connection failed. exiting now...");
        console.log(err);
        process.exit(1);
    })
}