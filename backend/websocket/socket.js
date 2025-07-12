import { WebSocketServer } from "ws";
import url from "url";
import Message from "../models/message.js";

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
    clients.set(userId, ws);

    ws.on("message", async (msg) => {
      const messageData = JSON.parse(msg);
      if (messageData.type === "send_message") {
        const { sender, recipient, content, requestId } = messageData.data;

        const savedMessage = await new Message({
          sender,
          recipient,
          content,
          requestId,
        });
        await savedMessage.save();

        const payload = {
          type: "receive_message",
          data: {
            _id: savedMessage._id,
            sender,
            recipient,
            content,
            requestId,
            sentAt: savedMessage.sentAt,
            status: savedMessage.status,
          }
        };

        
        const recipientSocket = clients.get(recipient);
        if (recipientSocket && recipientSocket.readyState === recipientSocket.OPEN) {
          recipientSocket.send(JSON.stringify(payload));
        }
        const clientSocket = clients.get(sender);
        if(clientSocket && clientSocket.readyState ==clientSocket.OPEN){
          clientSocket.send(JSON.stringify(payload));
        }
      }

    });

    ws.on("close", () => {
      clients.delete(userId);
    });
  });
}

export { setupWebSocket };
