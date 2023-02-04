import * as dotenv from 'dotenv';
dotenv.config();
import _ from "lodash";
import { car } from "../model/car.js";
import {bookcar} from "../model/bookcar.js";



const addnewcar = async (req, res) => {
    try {
        const data = new car(_.pick(req.body, ["userId", "carname", "carmodel", "carimage", "rentprice"]));
        if (!req.body) {
            throw Error("your details has been not submitted please require your data");
        }

        await data.save();

        res.status(200).json({
            status: "success",
            data: data
        });

    } catch (error) {
        const message = error.message;
        res.status(400).json({
            message: message
        });
    }
}


const viewbookcar = async (req,res) => {
    try {
        const view = await bookcar.find();
        
        res.status(200).json({
            status : "success",
            data : view
        });
    } catch (error) {
        const message =  error.message;
        res.status(400).json({
            message : message
        });
    }
}



const updatecar = async (req, res) => {
    try {
        const { id } = req.params;
        if (!req.params) {
            throw new Error("_id is require...");
        }

        const isvaildcar = await car.findByIdAndUpdate(id, req.body, { new: true });
        if (!isvaildcar) return res.status(400).json({ message: "_id is not valid..." });

        res.status(200).json({
            status: "success",
            data: (_.pick(isvaildcar, ["userId", "carname", "carmodel", "carimage", "rentprice"]))
        });
    } catch (error) {
        const message = error.message;
        res.status(400).json({
            message: message
        });
    }
}

const deletecar = async (req, res) => {
    try {
        const {id} = req.params;

        const isvaildcar = await car.findByIdAndRemove(id);
        if(!isvaildcar) return res.status(400).json({message : "id is not valid..."});

        res.status(200).json({
            status : "success",
            // data: (_.pick(isvaildcar, ["userId", "carname", "carmodel", "carimage", "rentprice"]))
        });
    } catch (error) {
        const message = error.message;
        res.status(400).json({
            message: message
        });
    }
}
export { addnewcar, updatecar, deletecar , viewbookcar};