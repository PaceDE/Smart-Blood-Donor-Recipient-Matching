import Message from "../models/message.js";
const getMessages = async (req, res) => {
    try {
        const userId = req.user._id;

        const messages = await Message.find({
            $or: [
                { sender: userId },
                { recipient: userId },
            ]
        }).sort({ sentAt: 1 });

        res.status(200).json(messages);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const messageRead = async (req, res) => {
    console.log(req.body);
    
    try {
        const { recipient, requestId } = req.body;

        const result = await Message.updateMany(
            {
                recipient: recipient,
                requestId: requestId,
                status: { $ne: "read" } 
            },
            {
                $set: { status: "read" }
            }
        );

        res.status(200).json({ success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Failed to mark messages as read" });
    }
};

const messageNotification = async (req, res) => {

    try {
        const { recipient} = req.body;

        const result = await Message.updateMany(
            {
                recipient: recipient,
                
                notificationStatus: { $ne: "sent" } 
            },
            {
                $set: { notificationStatus: "sent" }
            }
        );

        res.status(200).json({ success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Failed to mark as sent" });
    }
};


export { getMessages,messageRead,messageNotification };
