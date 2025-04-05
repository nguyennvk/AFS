"use client";
import { useEffect, useState } from "react";

interface Notification {
  notification_id: number;
  notification_type: string;
  notification_message: string;
  notification_date: Date;
  notification_read: boolean;
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    fetch("/api/notify") // Replace with your actual API endpoint
      .then(async (res) => {
        const response = await res.json();
        if (!res.ok) {
          setError(true);
          setErrorMessage(response.error);
        }
        return response;
      })
      .then((data) => setNotifications(data))
      .catch((err) => setError(err.message));
  }, []);

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <h1 className="text-3xl text-red-500">Error: {errorMessage}</h1>
      </div>
    );
  }

  const markAsRead = (id: string) => {
    fetch(`/api/notify/read?notiId=${id}`, { method: "POST", credentials: "include" })
      .then((res) => {
        if (res.ok) {
          setNotifications((prev) =>
            prev.map((notification) =>
              notification.notification_id === parseInt(id)
                ? { ...notification, notification_read: true }
                : notification
            )
          );
        }
      })
      .catch((err) => console.error("Error marking as read:", err));
  };

  // Sort notifications: unread at the top
  const sortedNotifications = [...notifications].sort((a, b) => {
    return Number(a.notification_read) - Number(b.notification_read); // Unread (false) comes first
  });

  return (
    <div className="p-7">
      <h2 className="text-xl font-bold mb-4">Notifications</h2>
      <ul>
        {sortedNotifications.map((notification) => (
          <li
            key={notification.notification_id}
            className={`p-3 border rounded-lg mb-2 flex justify-between items-center ${
              notification.notification_read ? "bg-green-500" : "bg-red-500"
            }`}
          >
            <div>
              <p className="font-semibold">{notification.notification_message}</p>
              <p className="text-sm text-gray-600">
                {new Date(notification.notification_date).toLocaleString().split("T")[0]}
              </p>
            </div>
            {/* Conditionally render the "Mark as Read" button */}
            {!notification.notification_read && (
              <button
                onClick={() => markAsRead(notification.notification_id.toString())}
                className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 cursor-pointer"
              >
                Mark as Read
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
