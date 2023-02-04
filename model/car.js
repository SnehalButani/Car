import mongoose from "mongoose";
import {user} from "./user.js";

const carSchema = new mongoose.Schema({
    userId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : user
    },
    carname : {
        type : String,
        required : true
    },
    carmodel : {
        type : String,
        required : true
    },
    carimage : {
        type : String,
        required : true
    },
    rentprice : {
        type : Number,
        required : true
    }
});

const car = mongoose.model("car",carSchema);

export {car , carSchema};