import * as dotenv from 'dotenv';
dotenv.config();
import _ from "lodash";
import nodemailer from "nodemailer";
import bcrypt from "bcryptjs";
import { user } from "../model/user.js";
import sendOTPVerification from "../model/sendOTPverification.js";


//default smtp transport => Nodemailer stuffe
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    requireTLS: true,
    secure: false,
    auth: {
        user: process.env.email,
        pass: process.env.pass
    }
});

//Registration
const registration = async (req, res) => {
    try {
        const data = new user(_.pick(req.body, ["firstname", "middlename", "lastname", "email", "phone", "password", "image", "role"]));
        if (!data) {
            throw Error("your details has been not submitted please require your data");
        }

        data.save()
            .then((result) => sendOTPVerificationEmail(result, res))
            .catch((error) => {
                const message = error.message;
                res.status(400).json({ message });
            });

        // res.status(200).json({
        //     status: "success",
        //     data: (_.pick(data, ["firstname", "middleware", "lastname", "email", "phone", "image", "role"]))
        // });
    } catch (error) {
        const message = error.message;
        res.status(400).json({
            message: message
        });
    }
}

//login
const login = async (req, res) => {
    try {
        const { email, password, role } = req.body;
        if (!req.body) {
            throw Error("please require your data");
        }
        const isEmail = await user.findOne({ email, role });
        if (!isEmail) return res.status(401).json({ message: "Email is wrong... & role is wrong..." });

        const isPassword = await bcrypt.compare(password, isEmail.password);
        if (!isPassword) {
            return res.status(401).json({ message: "password is worng..." });
        } else {
            const token = await isEmail.createtoken();
            res.status(200).json({
                status: "success",
                token: token
            });
        }
        // res.cookie("login",token,{
        //     httpOnly : true,
        //     expireaAt : new Date(Date.now() + 600000)
        // });
    } catch (error) {
        const message = error.message;
        res.status(400).json({
            message: message
        });
    }
}

//collection user ==> update
const updatemethods = async (req, res) => {
    try {
        const { id } = req.params;
        if (!req.params) {
            throw new Error("_id is require...");
        }

        const isvailduser = await user.findByIdAndUpdate(id, req.body, { new: true });
        if (!isvailduser) return res.status(400).json({ message: "_id is not valid..." });

        res.status(200).json({
            status: "success",
            data: (_.pick(isvailduser, ["firstname", "middleware", "lastname", "email", "phone", "image", "role"]))
        });
    } catch (error) {
        const message = error.message;
        res.status(400).json({
            message: message
        });
    }
}


//collection user ==> delete
const deletemethods = async (req, res) => {
    try {
        const { id } = req.params;
        if (!req.params) {
            throw Error("_id is require...");
        }

        const isvailduser = await user.findByIdAndRemove(id);
        if (!isvailduser) return res.status(400).json({ message: "_id is not valid..." });


        res.status(200).json({
            status: "success",
            // data : (_.pick(isvailduser,["firstname", "middleware", "lastname", "email", "phone", "image", "role"]))
        });
    } catch (error) {
        const message = error.message;
        res.status(400).json({
            message: message
        });
    }
}

//send otp code
const sendOTPVerificationEmail = async ({ _id, email }, res) => {
    try {
        const otp = `${Math.floor(1000 + Math.random() * 9000)}`;

        const mailoption = {
            from: process.env.email,
            to: email,
            subject: "Verify your email",
            html: `<p>Enter <h2>${otp}</h2> in the app verify your email address and complate</p>
            This code <u><b>expries in 1 Hours</b></u>`
        }

        //hash to otp
        const saltRounds = 10;
        const hashotp = await bcrypt.hash(otp, saltRounds);
        const newUserverification = new sendOTPVerification({
            userId: _id,
            otp: hashotp,
            createdAt: Date.now(),
            expireaAt: Date.now() + 3600000
        });

        //save otp recordes
        await newUserverification.save();

        //send otp
        await transporter.sendMail(mailoption);

        res.json({
            status: "Peading",
            message: "Verification otp email sent",
            data: {
                userId: _id,
                email: email
            }
        });

    } catch (error) {
        const message = error.message;
        res.status(400).json({
            status: "not success",
            message: message
        });
    }
}


//verify the code
const verify = async (req, res) => {
    try {
        const { userId, otp } = req.body;
        if (!userId || !otp) {
            throw Error("Empty otp details are not allowed");
        } else {
            const UserOTPverificationRecords = await sendOTPVerification.find({
                userId
            });
            if (UserOTPverificationRecords.length <= 0) {
                //no records found
                throw new Error(
                    "Account records does not exist or has been verified already . please sign up or log in."
                )
            } else {
                const { expireaAt } = UserOTPverificationRecords[0];
                const hashotp = UserOTPverificationRecords[0].otp;
                if (expireaAt < Date.now()) {
                    //user otp records has expried
                    await UserOTPverificationRecords.deleteMany({ userId });
                    throw new Error("Code has expried.please request again...");
                } else {
                    const vaildAt = await bcrypt.compare(otp, hashotp);
                    if (!vaildAt) {
                        //supply otp is wrong
                        throw new Error("Invaild code passed.check your inbox...");
                    } else {
                        //success
                        await user.updateOne({ _id: userId }, { verify: true });
                        await sendOTPVerification.deleteMany({ userId });
                        res.status(200).json({
                            status: "Verified",
                            message: "User email verified successfully"
                        })
                    }
                }
            }
        }
    } catch (error) {
        const message = error.message;
        res.status(400).json({
            message: message
        });
    }
}


//reset otp 
const resetOtp = async (req, res) => {
    try {
        const { userId, email } = req.body;
        if (!userId || !email) {
            throw Error("Empty otp details are not allowed...");
        } else {
            await sendOTPVerification.deleteMany({ userId });
            sendOTPVerificationEmail({ _id: userId, email }, res);
        }
    } catch (error) {
        const message = error.message;
        res.status(400).json({
            message: message
        });
    }
}
export { registration, resetOtp, verify, login, deletemethods, updatemethods }; 