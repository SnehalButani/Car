import mongoose from "mongoose";

const UserOTPverificationSchema = new mongoose.Schema({
    userId : String,
    otp : String,
    createdAt : Date,
    expireaAt : Date
});

const UserOTPverification = mongoose.model('UserOTPverification',UserOTPverificationSchema);

export default UserOTPverification;