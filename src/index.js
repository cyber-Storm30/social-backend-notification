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
app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:8000"],
  })
);
app.use(cookieParser());
dotenv.config();
const PORT = process.env.PORT || 8008;

const server = http.createServer(app);
export const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST"],
  },
});

let connectedUsers = {};

io.on("connection", (socket) => {
  socket.on("join", (userId) => {
    console.log("User id in join", userId, "socket id", socket.id);
    connectedUsers[userId] = socket.id;
    console.log("&", connectedUsers);
  });

  console.log("&", connectedUsers);

  // socket.on("disconnect", () => {
  //   const userId = Object.keys(connectedUsers).find(
  //     (id) => connectedUsers[id] === socket.id
  //   );
  //   if (userId) {
  //     delete connectedUsers[userId];
  //   }
  // });
});

//routes
app.use("/", NotificationRouter);

server.listen(PORT, async () => {
  console.log("Notification Server connected on port", PORT);
  await connectDb();
  init("g1", io, connectedUsers);
});
