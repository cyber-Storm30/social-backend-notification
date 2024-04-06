import NotificationService from "../services/notification.service.js";

class NotificationController {
  async sendMessage(req, res) {
    try {
      const response = await NotificationService.sendNotification();
      //   res.status(200).json({
      //     success: true,
      //     message: "Message send successfully",
      //     data: response,
      //   });
      res.status(200).json("OK");
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
}

export default new NotificationController();
