import express, { Request, Response } from "express";
import * as dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";
import connectDB from "./dbConfig/connect";
import routesAuth from "./routes/authRoutes";

const app = express();
dotenv.config();
connectDB();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(`/api/${process.env.VERSION_API}/auth`, routesAuth);
app.listen(`${process.env.PORT}`);
