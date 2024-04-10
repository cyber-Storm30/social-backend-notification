import NotificationService from "../services/notification.service.js";

class NotificationController {
  async getAllNotification(req, res) {
    try {
      const { userId } = req.query;
      const response = await NotificationService.getAllNotification(userId);
      res.status(200).json({
        data: response,
      });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
}

export default new NotificationController();
