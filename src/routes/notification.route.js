import express from "express";

import notificationController from "../controllers/notification.controller.js";
const router = express.Router();

router.get("/", notificationController.getAllNotification);

export default router;
