import NotificationModel from "../models/notification.model.js";
import axios from "axios";
import { BASE_URL } from "../config/connection.js";

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
      const post = await axios.get(
        `${BASE_URL}/post/single/post?postId=${savedNotification.postId}`
      );
      const sender = await axios.get(
        `${BASE_URL}/auth/user/${savedNotification.sender}`
      );
      const receiver = await axios.get(
        `${BASE_URL}/auth/user/${savedNotification.receiver}`
      );
      const newSavedNotification = {
        ...savedNotification.toObject(),
        postId: post.data.data,
        sender: sender.data.data,
        receiver: receiver.data.data,
      };
      return newSavedNotification;
    } catch (err) {
      throw err;
    }
  }
  async getAllNotification(userId) {
    try {
      const notifications = await NotificationModel.find({ receiver: userId });
      console.log(notifications);

      const notificationWithUserDetails = await Promise.all(
        notifications?.map(async (notification) => {
          try {
            const post = await axios.get(
              `${BASE_URL}/post/single/post?postId=${notification?.postId}`
            );
            const sender = await axios.get(
              `${BASE_URL}/auth/user/${notification?.sender}`
            );
            const receiver = await axios.get(
              `${BASE_URL}/auth/user/${notification?.receiver}`
            );
            const newNotification = {
              ...notification.toObject(),
              postId: post.data.data,
              sender: sender.data.data,
              receiver: receiver.data.data,
            };
            return newNotification;
          } catch (err) {
            console.log(err);
            return notifications;
          }
        })
      );
      return notificationWithUserDetails;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }
}

export default new NotificationService();
