import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router";
import { useSocket } from "./SocketContext";
import { XCircle, Send } from "lucide-react";
import '../App.css';
import Loading from "./Loading";
import { useAuth } from "./AuthContext";
import { toast } from "react-toastify";

const Chat = ({ chatOpen, setChatOpen, sendFrom, sendTo, name, requestId }) => {
    const location = useLocation();
    const currentPath = location.pathname;
    const [typedMessage, setTypedMessage] = useState("");
    const { socket, messages, setMessages, messageLoading } = useSocket();
    const { user } = useAuth();
    const scrollRef = useRef(null);
    const recipientRole = currentPath.includes("request") ? "donor" : "requester";
    console.log(recipientRole);

    const chatMessages = messages?.filter(
        (msg) =>
            ((msg.sender === sendFrom && msg.recipient === sendTo) ||
                (msg.sender === sendTo && msg.recipient === sendFrom)) &&
            msg.requestId === requestId
    ) || [];


    useEffect(() => {

        const unreadMessages = messages.filter(
            (msg) =>
                msg.requestId === requestId &&
                msg.recipient === user._id &&
                msg.status === "sent"
        );

        if (unreadMessages.length === 0) return; 

        
        setMessages((prevMessages) =>
            prevMessages.map((msg) =>
                msg.requestId === requestId &&
                    msg.recipient === user._id &&
                    msg.status !== "read"
                    ? { ...msg, status: "read" }
                    : msg
            )
        );
        const readMessage = async () => {

           
                const messageInfo = {
                    recipient: user._id,
                    requestId: requestId
                }
                try {
                    const res = await fetch("http://localhost:5000/api/messageRead", {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        credentials: 'include',
                        body: JSON.stringify(messageInfo)
                    });
                    if (!res.ok) {
                        throw new Error('Failed to mark as read');
                    }

                }
                catch (err) {
                    console.error(err);
                }

            }

        
        readMessage();


    }, [messages])

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [chatMessages]);


    const handleSend = () => {
        if (!typedMessage.trim()) return;

        const messageToSend = {
            sender: sendFrom,
            recipient: sendTo,
            recipientRole: recipientRole,
            requestId: requestId,
            content: typedMessage.trim(),
        };

        socket.current.send(JSON.stringify({
            type: "send_message",
            data: messageToSend,
        }));


        setTypedMessage("");
    };

    if (messageLoading)
        return <Loading loadingText="Loading Chat history..." />


    return (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg w-11/12 max-w-md max-h-[80vh] flex flex-col">
                {/* Header */}
                <div className="flex justify-between items-center p-4 border-b border-gray-300">
                    <div className="flex items-center gap-3">
                        <div className="flex justify-center item-center bg-red-500 text-white p-3 rounded-full ">
                            {name.split(" ").map(name => name[0].toUpperCase())}
                        </div>

                        <h2 className="font-semibold text-lg">{name}</h2>

                    </div>
                    <XCircle
                        onClick={() => setChatOpen(false)}
                        className="text-gray-600 hover:text-gray-900"
                    />


                </div>

                {/* Messages placeholder */}
                <div ref={scrollRef} style={{ scrollbarWidth: 'none' }} className="flex flex-col p-4 min-h-[350px] max-h-[350px] overflow-y-auto space-y-2 text-gray-500 ">
                    {chatMessages.length === 0 ? (
                        <p>No Messages yet</p>

                    ) : (
                        chatMessages.map((msg) => (
                            <div key={msg._id} className={` p-2 font-normal rounded-xl inline-block ${msg.sender === sendFrom ? "bg-red-500 text-white self-end" : "bg-gray-200 text-black self-start"}`}>{msg.content}</div>

                        ))

                    )}

                </div>

                {/* Input area placeholder */}
                <div className="p-4 border-t border-gray-300  flex gap-2">
                    <textarea
                        rows="1"
                        placeholder="Type your message..."

                        style={{ scrollbarWidth: 'none' }}
                        className="text-black font-normal flex-1 border rounded-lg px-3 py-2 bg-gray-100 border-gray-300 resize-none focus:outline-red-500"

                        value={typedMessage}
                        onChange={(e) => setTypedMessage(e.target.value)}
                    />
                    <button
                        disabled={typedMessage === ""}
                        onClick={handleSend}
                        className={`text-white px-3 rounded ${typedMessage === "" ? "bg-red-300" : "bg-red-500 hover:bg-red-600"}`}>

                        <Send className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Chat;
