import { useContext, useEffect, useRef, createContext,useState} from "react";
import { useAuth } from './AuthContext';
import { toast } from "react-toastify";

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
    const { user, loading } = useAuth();
    const [messages,setMessages] =useState([]);
    const [messageLoading,setMessageLoading] = useState(false)

    const socket = useRef(null);

    useEffect(()=>{
        if (loading || !user) return;
        const fetchMessages = async ()=>{
            setMessageLoading(true)
            try{
                const res = await fetch("http://localhost:5000/api/getMessages",{
                    method:"GET",
                    credentials:"include",
                });
                if(!res.ok){
                    throw new Error("Failed to fetch messages");
                }
                const data = await res.json();
                setMessages(data);
            }
            catch(err){
                console.error("Error fetching messages:", err.message);
            }
            finally{
                setMessageLoading(false);
            }
            
        }
        fetchMessages();

    },[loading,user]);

    useEffect(() => {
        if (loading || !user) return;

        const ws = new WebSocket(`ws://localhost:5000/ws?userId=${user._id}`);
        socket.current = ws;

        ws.onopen = () => {
            console.log("Socket connected as user:");
        };
        ws.onmessage = (event) => {
            const msg = JSON.parse(event.data);

            if (msg.type === "receive_message") {
                const newMsg =msg.data;
                setMessages((prev) =>{
                    const alreadyExists=prev.some((m)=>m._id===newMsg._id);
                    const updated= alreadyExists? prev : [...prev,newMsg];
                    return updated.sort((a,b)=>new Date(a.sentAt)- new Date(b.sentAt));
                });
            }
            if (msg.type === "error") {
                const newMsg =msg.data;
                toast.error(newMsg.message)
                setTimeout(()=>{window.location.reload()},1500);
            }
        };

        ws.onclose = () => {
            console.log("Socket closed");

        }
        ws.onerror = (err) => {
            console.error("WebSocket error:", err);
        };

        return () => {
            if (socket.current?.readyState === WebSocket.OPEN) {
                socket.current.close();
            }
        };
    }, [loading, user]);

    return (
        <SocketContext.Provider value={{socket,messages,setMessages,messageLoading}}>
            {children}
        </SocketContext.Provider>
    );
};

export const useSocket = () => {
    return useContext(SocketContext);
};
