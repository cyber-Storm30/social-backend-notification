import kafka from "../config/kafkaClient.js";
import NotificationService from "../services/notification.service.js";
import { connectDb } from "../config/connection.js";

// const group = process.argv[2];

export const init = async (group, io, connectedUsers) => {
  const consumer = kafka.consumer({ groupId: group });
  await consumer.subscribe({ topics: ["notifications"], fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ topic, partition, message, heartbeat, pause }) => {
      try {
        const messageData = JSON.parse(message.value.toString());
        const { userId, ...messageContent } = messageData;

        console.log(messageData);

        console.log("connected users", connectedUsers);

        if (messageData.receiverId !== messageData.senderId) {
          if (connectedUsers[messageData.receiverId]) {
            await connectDb();
            const response = await NotificationService.sendNotification(
              messageData
            );
            io.to(connectedUsers[messageData.receiverId]).emit(
              "notifications",
              response
            );
          } else {
            console.log(`User with ID ${userId} not connected`);
          }
        }
      } catch (error) {
        console.error("Error processing notification:", error);
      }
    },
  });
};
