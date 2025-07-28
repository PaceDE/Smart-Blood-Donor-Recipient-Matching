import { WebSocketServer } from "ws";
import url from "url";
import Message from "../models/message.js";
import User from "../models/users.js";

function setupWebSocket(server) {
  const wss = new WebSocketServer({ server, path: "/ws" });
  const clients = new Map();

  wss.on("connection", (ws, req) => {
    const params = url.parse(req.url, true);
    const { userId } = params.query;

    if (!userId) {
      ws.close(4001, "User ID missing");
      return;
    }

    ws.userId = userId;
    if (!clients.has(userId)) {
      clients.set(userId, new Set());
    }
    clients.get(userId).add(ws);


    ws.on("message", async (msg) => {
      const messageData = JSON.parse(msg);
      if (messageData.type === "send_message") {
        const { sender, recipient, recipientRole,content, requestId } = messageData.data;
        
        const senderData = await User.findById(sender).select('fullName');

        const savedMessage = await new Message({
          sender,
          recipient,
          senderName:senderData.fullName,
          recipientRole,
          content,
          requestId,
        });
        await savedMessage.save();

        

        const payload = {
          type: "receive_message",
          data: {
            _id: savedMessage._id,
            sender,
            senderName:savedMessage.senderName,
            recipient,
            recipientRole,
            requestId,
            content,
            status: savedMessage.status,
            notificationStatus: savedMessage.notificationStatus,
            sentAt: savedMessage.sentAt,
          }
        };


        const recipientSockets = clients.get(recipient);
        if (recipientSockets) {
          for (const sock of recipientSockets) {
            if (sock.readyState === sock.OPEN) {
              sock.send(JSON.stringify(payload));
            }
          }
        }

        // Send to all sockets of the sender (mirror it)
        const senderSockets = clients.get(sender);
        if (senderSockets) {
          for (const sock of senderSockets) {
            if (sock.readyState === sock.OPEN) {
              sock.send(JSON.stringify(payload));
            }
          }
        }
      }

    });

    ws.on("close", () => {
      const userSockets = clients.get(userId);
      if (userSockets) {
        userSockets.delete(ws);
        if (userSockets.size === 0) {
          clients.delete(userId);
        }
      }
    });
  });
}

export { setupWebSocket };
