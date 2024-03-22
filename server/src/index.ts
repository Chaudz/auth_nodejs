import express, { Request, Response } from "express";
import * as dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";
import connectDB from "./dbConfig/connect";
import router from "./routes";

const app = express();
dotenv.config();
connectDB();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(`/${process.env.VERSION_API}`, router);
app.listen(`${process.env.PORT}`);
