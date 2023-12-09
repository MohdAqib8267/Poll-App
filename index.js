import express from "express";
import dotenv from 'dotenv';
import cookieParser from "cookie-parser";
import cors from 'cors';
import { pollRoute } from "./routes/pollRoute.js";
import { userRoute } from "./routes/userRoute.js";

dotenv.config();

const PORT = process.env.PORT || 3000;  


const app = express();


app.use(express.json());
app.use(cookieParser());
app.use(cors());



app.listen(PORT,()=>{
    console.log(`Server is running at port ${PORT}`)
})


app.use("/api/poll",pollRoute);
app.use('/api/user',userRoute);
