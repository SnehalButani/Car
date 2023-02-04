import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import * as dotenv from 'dotenv';
dotenv.config();

const userSchema = new mongoose.Schema({
    firstname : {
        type : String,
        required : true
    },
    middlename: {
        type : String,
        required : true
    },
    lastname : {
        type : String,
        required : true
    },
    email :  {
        type : String,
        required : true
    },
    phone : {
        type : Number,
        required : true
    },
    password : {
        type : String,
        required : true
    },
    image : {
        type: String,
        required : true
    },
    role : {
        type : String,
        required :true,
        enum : {
            values : ['customer','user','admin'],
            message : '{VALUE} not role availabel'
        }
    },
    verify : {
        type : Boolean,
        default : false
    },
    time: {
        type: Date,
        default: Date.now()
    }
});

userSchema.pre("save", async function (next) {
    if(this.isModified("password")){
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});


userSchema.methods.createtoken = async function (next) {
    try {
        const token = jwt.sign({_id : this._id.toString()},`${process.env.keyshort}`);
        return token;
        // next();
    } catch (error) {
        console.log("token not created...");
    }
}

const user = mongoose.model('user',userSchema);

export {user , userSchema} ;