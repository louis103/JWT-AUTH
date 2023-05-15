//create middleware for authentication
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

//config
dotenv.config({ path: './config/config.env' });
const config = process.env;

const verifyToken = (req,res,next) => {
    const token = req.body.token || req.query.token || req.headers["x-access-token"];
    if(!token){
        return res.status(403).send("A auth token is required!");
    }
    //we have token
    try {
        const decoded = jwt.verify(token,config.TOKEN_KEY);
        req.user = decoded;
    } catch (error) {
        console.log(error);
        res.status(500).send("Invalid token");
    }
    return next();
};
module.exports = verifyToken;