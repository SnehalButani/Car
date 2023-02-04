import {addnewcar,updatecar,deletecar,viewbookcar} from "../controller/car.js"; 
import token from "../middleware/token.js";
import  Express  from "express";
const app = Express();


const router = Express.Router();
router.post("/addnewcar",token,addnewcar);
router.post("/viewbookcar",token,viewbookcar);
router.post("/updatecar/:id",token,updatecar);
router.post("/deletecar/:id",token,deletecar);

export default router;