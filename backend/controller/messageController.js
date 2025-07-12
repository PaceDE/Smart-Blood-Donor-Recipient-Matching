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

export {getMessages};
