import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  senderName:{
    type:String,
    required:true,
  },
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  recipientRole: {
    type:String,
    enum:["donor","requester"],
    required:true,
  },
  requestId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "RequestInfo",
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  sentAt: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ["sent", "read"],
    default: "sent",
  },
  notificationStatus:{
    type: String,
    enum: ["sent", "notsent"],
    default: "notsent",
  }
});

const Message = mongoose.model("Message", messageSchema);

export default Message;
