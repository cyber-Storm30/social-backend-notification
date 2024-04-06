import kafka from "../config/kafkaClient.js";
import NotificationService from "../services/notification.service.js";
import NotificationModel from "../models/notification.model.js";
import { connectDb } from "../config/connection.js";
import { io } from "../index.js";

const group = process.argv[2];

export const init = async (group) => {
  const consumer = kafka.consumer({ groupId: group });
  console.log("Consumer running");
  await consumer.subscribe({ topics: ["notifications"], fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ topic, partition, message, heartbeat, pause }) => {
      try {
        await connectDb();
        const messageData = JSON.parse(message.value.toString());
        await NotificationService.sendNotification(messageData);
        io.on("connection", (socket) => {
          socket.emit("notifications", messageData);
        });
      } catch (error) {
        console.error("Error processing notification:", error);
      }
    },
  });
};
