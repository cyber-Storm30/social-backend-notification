import express from "express";
import http from "http";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import NotificationRouter from "./routes/notification.route.js";
import { connectDb } from "./config/connection.js";
import { Server } from "socket.io";
import { init } from "./kafka/consumer.js";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(cookieParser());
dotenv.config();
const PORT = process.env.PORT || 8008;

const server = http.createServer(app);
export const io = new Server(server);

//routes
app.use("/", NotificationRouter);

server.listen(PORT, async () => {
  console.log("Notification Server connected on port", PORT);
  await connectDb();
  init("g1");
});
