import * as dotenv from 'dotenv';
dotenv.config();
import  Jwt  from 'jsonwebtoken';

export default (req,res,next) => {
    const token = req.header('x-auth-token');
    if(!token){
        throw Error("Access denied. No token provide...");
    }
    try {
        const verify = Jwt.verify(token,`${process.env.keyshort}`);
        next();
    } catch (error) {
        res.status(401).json({error});
    }
}
// exports.createtoken = createtoken();