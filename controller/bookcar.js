import * as dotenv from 'dotenv';
dotenv.config();
import _ from "lodash";
import { bookcar } from "../model/bookcar.js";
import { car } from "../model/car.js";



const addbookcar = async (req, res) => {    
    try {
        const data = await bookcar.create({
            carId :req.body.carId,
            customername : req.body.carname,
            customerimage : req.file.filename,
            adharcardnumber : req.body.adharcardnumber,
            carname : req.body.carname
        });
        if(!req.body || !req.file){
            throw Error("your data has been not submitted or require data...");
        }
        // await data.save();
        
        res.status(200).json({
            status: "success",
            data: (_.pick(data, ["carId", "customername", "customerimage", "adharcardnumber", "carname"]))
        });
    } catch (error) {
        const message = error.message;
        res.status(400).json({ message: message });
    }
}


const viewbookuser = async (req,res) => {
    try {
        const view = await car.find();

        res.status(200).json({
            status : "success",
            data : view
        });
    } catch (error) {
        const message = error.message;
        res.status(400).json({
            message : message
        });
    }
}



const updatebookcar = async (req, res) => {
    try {
        const { id } = req.params;
        if (!req.params) {
            throw Error("id id require...");
        }

        const isvaildbookcar = await bookcar.findByIdAndUpdate(id, req.body, { new: true });
        if (!isvaildbookcar) return res.status(400).json({ message: "id is not valid..." });

        res.status(200).json({
            status: "success",
            data: (_.pick(isvaildbookcar, ["carId", "customername", "customerimage", "adharcardnumber", "carname"]))
        });
    } catch (error) {
        const message = error.message;
        res.status(400).json({ message: message });
    }
}



const deletebookcar = async (req, res) => {
    try {
        const { id } = req.params;
        if (!req.params) {
            throw Error("id id require...");
        }

        const isvaildbookcar = await bookcar.findByIdAndRemove(id);
        if (!isvaildbookcar) return res.status(400).json({ message: "id is not valid..." });

        res.status(200).json({
            status: "success",
            // data: (_.pick(isvaildbookcar, ["carId", "customername", "customerimage", "adharcardnumber", "carname"]))
        });
    } catch (error) {
        const message = error.message;
        res.status(400).json({ message: message });
    }
}

export { addbookcar, updatebookcar, deletebookcar , viewbookuser};