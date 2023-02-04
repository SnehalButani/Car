import {registration,resetOtp,verify,login,updatemethods,deletemethods} from "../controller/user.js";
import  Express  from "express";
const app = Express();

const router = Express.Router();

router.get("/",(req,res)=>res.json({API : "Car api"}));
router.post("/Registration",registration);
router.post("/login",login);
router.post("/resetOtp",resetOtp);
router.post("/verify",verify);
router.post("/update/:id",updatemethods);
router.post("/delete/:id",deletemethods);


export default router;