import express from "express";
import cookieParser from "cookie-parser";
import cors from 'cors';
import morgan from "morgan";

const app = express();

app.use(express.json);
app.use(express.urlencoded({extended:true}));
app.use(cors()); // security 
app.use(cookieParser());

app.use(morgan('tiny')) // Logs the route request details. API req n res



export default app;
