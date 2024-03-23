import express, { Request, Response } from "express";
import * as dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";
import connectDB from "./dbConfig/connect";
import routesAuth from "./routes/authRoutes";
import routesToken from "./routes/tokenRoutes";
import routesUser from "./routes/userRoutes";

const app = express();
dotenv.config();
connectDB();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(`/api/${process.env.VERSION_API}/auth`, routesAuth);
app.use(`/api/${process.env.VERSION_API}`, routesToken);
app.use(`/api/${process.env.VERSION_API}/user`, routesUser);
app.listen(`${process.env.PORT}`);
