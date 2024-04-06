import NotificationModel from "../models/notification.model.js";
import axios from "axios";

class NotificationService {
  async sendNotification(payload) {
    try {
      const { senderId, receiverId, type, postId } = payload;
      const newNotification = new NotificationModel({
        sender: senderId,
        receiver: receiverId,
        type: type,
        postId: postId,
      });
      const savedNotification = await newNotification.save();
      return savedNotification;
    } catch (err) {
      console.error("Error saving notification:", err);
      throw err;
    }
  }
}

export default new NotificationService();
