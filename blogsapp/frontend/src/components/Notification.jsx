import { useNotificationValue } from "../NotificationContext";
import "./Notification.css";

const Notification = () => {
  const notification = useNotificationValue();

  if (!notification) {
    return null;
  }

  return <p className="notification">{notification}</p>;
};

export default Notification;
