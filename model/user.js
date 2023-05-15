const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    first_name:{
        type: String,
        default: null
    },
    last_name:{
        type: String,
        default: null
    },
    email:{
        type: String,
        unique:true,
        required:true
    },
    password:{
        type: String,
        unique:true
    },
    token:{
        type: String,
        unique:true
    }
});

module.exports = mongoose.model("user",userSchema);