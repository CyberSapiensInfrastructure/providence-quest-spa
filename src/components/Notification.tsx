// src/components/StackedNotifications.tsx
import { AnimatePresence, motion } from "framer-motion";
import { FiAlertCircle, FiX } from "react-icons/fi";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../app/store";
import { removeNotification } from "../app/slices/notificationSlice";
import CornerDots from "./CornerDots";

const Notification = ({
  text,
  id,
  type,
  removeNotif,
}: NotificationType & { removeNotif: (id: string) => void }) => {
  useEffect(() => {
    const timeoutRef = setTimeout(() => {
      removeNotif(id);
    }, NOTIFICATION_TTL);

    return () => clearTimeout(timeoutRef);
  }, [id, removeNotif]);

  return (
    <motion.div
      layout
      initial={{ y: 15, scale: 0.9, opacity: 0 }}
      animate={{ y: 0, scale: 1, opacity: 1 }}
      exit={{ y: -15, scale: 0.9, opacity: 0 }}
      transition={{ type: "spring" }}
      className={`p-4 w-80 flex items-start gap-2 text-sm font-medium shadow-lg text-white fixed z-50 bottom-4 right-4 ${
        type === "success" ? "bg-green-600" : "bg-yellow-600"
      }`}
    >
      <FiAlertCircle className="text-3xl mr-2" />
      <span>{text}</span>
      <button onClick={() => removeNotif(id)} className="ml-auto mt-0.5">
        <FiX />
      </button>
      <CornerDots />
    </motion.div>
  );
};

const StackedNotifications = () => {
  const notifications = useSelector(
    (state: RootState) => state.notification.notifications
  );
  const dispatch = useDispatch();

  const handleRemove = (id: string) => {
    dispatch(removeNotification(id));
  };

  return (
    <div className="fixed bottom-5 right-5 flex flex-col space-y-2 z-50">
      <AnimatePresence>
        {notifications.map((notification) => (
          <Notification
            text={notification.message}
            key={notification.id}
            {...notification}
            removeNotif={handleRemove}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

const NOTIFICATION_TTL = 2000;

type NotificationType = {
  id: string;
  text: string;
  type: string;
};

export default StackedNotifications;
