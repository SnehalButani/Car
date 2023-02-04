import mongoose, { mongo, Schema } from "mongoose";
import { car } from "./car.js";

const bookedSchema = mongoose.Schema({
    carId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: car
    },
    customername: {
        type: String,
        required: true
    },
    customerimage: {
        type: String,
        required: true
    },
    adharcardnumber: {
        type: Number,
        required: true
    },
    carname: {
        type: String,
        required: true
    }
});

const bookcar =  mongoose.model("bookcar", bookedSchema);

export { bookedSchema, bookcar };