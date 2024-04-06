import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    sender: { type: String, default: "" },
    receiver: { type: String, default: "" },
    type: { type: String, default: "" },
    isRead: { type: Boolean, default: false },
    postId: { type: String, default: "" },
    commentId: { type: String, default: "" },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Notification", notificationSchema);
