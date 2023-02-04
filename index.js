import  express  from "express";
import mongoose from "mongoose";
import role from "./routes/user.js";
import car from "./routes/car.js";
import bookcar from "./routes/bookcar.js";
const app = express();

main();
async function main() {
  await mongoose.connect("mongodb+srv://Snehal:12345@cluster0.pegveid.mongodb.net/Car")
  .then(()=>console.log("mongodb connectd"))
  .catch(err => console.log(err))
}

// app.use(cors()); 
app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(role);
app.use(car);
app.use(bookcar);


const port = 8000 || process.env.port;
const hostname = "127.0.0.1";
app.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});