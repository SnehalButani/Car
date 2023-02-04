import { addbookcar, updatebookcar, deletebookcar, viewbookuser } from "../controller/bookcar.js";
import token from "../middleware/token.js";
import upload from "../middleware/img.js";
import Express from "express";
const app = Express();


const router = Express.Router();
router.post("/addbookcar", token, upload.single('customerimage'), addbookcar);
router.post("/viewbookuser", token, viewbookuser);
router.post("/updatebookcar/:id", token, updatebookcar);
router.post("/deletebookcar/:id", token, deletebookcar);

export default router;