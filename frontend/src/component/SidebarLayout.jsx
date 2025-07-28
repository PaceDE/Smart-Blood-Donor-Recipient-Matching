import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import addNotification from 'react-push-notification';
import { useSocket } from './SocketContext';
import { useAuth } from './AuthContext';

function SidebarLayout() {
  const { messages,setMessages } = useSocket();
  const { user } = useAuth();
  useEffect(() => {

    const unnotifiedMessages = messages.filter(
      (msg) =>

        msg.recipient === user._id &&
        msg.notificationStatus == "notsent"
    );

    if (unnotifiedMessages.length === 0) return;

    
      for (const msg of unnotifiedMessages) {
        addNotification({
          title: `New Message received from ${msg.senderName}`,
          message: `Message: ${msg.content}`,
          native: true,
          duration: 60000,
          onClick: () => {
            window.focus();
            window.location.href = '/home';
          },
        });

      }
    

    setMessages((prevMessages) =>
      prevMessages.map((msg) =>
        msg.recipient === user._id &&
          msg.notificationStatus !== "sent"
          ? { ...msg, notificationStatus: "sent" }
          : msg
      )
    );
    const NotificationUpdate = async () => {
      const messageInfo = {
        recipient: user._id,
      }
      try {
        const res = await fetch("http://localhost:5000/api/messageNotification", {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          credentials: 'include',
          body: JSON.stringify(messageInfo)
        });
        if (!res.ok) {
          throw new Error('Failed to mark as sent');
        }

      }
      catch (err) {
        console.error(err);
      }

    }


    NotificationUpdate();

  }, [messages])
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch('http://localhost:5000/api/pendingNotifications', { credentials: 'include' });
        if (!res.ok) return;


        const pendingLogs = await res.json();
        if (pendingLogs) {
          for (const log of pendingLogs) {
            addNotification({
              title: 'Notification from BloodLink - Blood Needed Nearby',
              message: `A blood request matching your type is ${log.distance} km away.`,
              native: true,
              duration: 60000,
              onClick: () => {
                window.focus();
                window.location.href = '/home/donate';
              },
            });


            // Mark notification as sent on backend
            await fetch(`http://localhost:5000/api/markNotification/${log._id}`, {
              method: 'POST',
              credentials: 'include',
              headers: { 'Content-Type': 'application/json' },
            });

          }


        }

      } catch (error) {
        console.error('Notification polling error:', error);
      }
    }, 60000); // poll every 60 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 overflow-y-auto bg-[#f9fafb]">
        <Outlet />
      </main>
    </div>
  );
}

export default SidebarLayout;
