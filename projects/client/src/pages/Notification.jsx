import {useEffect, useState} from "react";
import {api} from "../API/api";
import {MdError, MdCheckCircle} from "react-icons/md";
import NotificationDetailModal from "../components/NotificationDetailModal";
import moment from "moment";

export default function Notification() {
  const [notifications, setNotifications] = useState([]);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  console.log(notifications);
  const fetchNotification = async () => {
    try {
      let response = await api.get(`/notification/2`);
      setNotifications(response.data.notif);
      console.log(response.data.notif);
    } catch (error) {
      console.log(error);
    }
  };

  const openModal = (notificationId) => {
    setSelectedNotification(notificationId);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedNotification(null);
    setIsModalOpen(false);
  };

  useEffect(() => {
    fetchNotification();
  }, []);

  return (
    <div className="pt-24 cursor-default">
      <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
        Notifications
      </h1>
      <div className="flex pt-6 min-h-[650px] justify-center ">
        <ul role="list" className="flex flex-col gap-3">
          {notifications.map((notification) => {
            const readStatus =
              notification.UserNotifications.length > 0
                ? notification.UserNotifications[0].read
                : false;
            return (
              <li
                key={notification.id}
                onClick={() => openModal(notification.id)}
                className={`relative py-4 px-4 rounded-full w-[650px] md:w-full sm:w-full focus-within:ring-2 focus-within:ring-inset focus-within:ring-gray-600  ${
                  readStatus ? "bg-gray-100" : "bg-gray-200"
                }`}>
                <div className="flex gap-10 items-center space-x-3">
                  <div className="min-w-0 flex-1">
                    <a href="#" className="block focus:outline-none">
                      <span className="absolute inset-0" aria-hidden="true" />
                      <p className="truncate text-sm font-medium text-gray-900">
                        {notification.title}
                      </p>
                    </a>
                  </div>
                  <time
                    dateTime={notification.createdAt}
                    className="flex-shrink-0 whitespace-nowrap text-sm text-gray-500 pr-14">
                    {moment(notification.createdAt).startOf("hour").fromNow()}
                  </time>
                </div>
                {readStatus ? (
                  <MdCheckCircle className="w-5 h-5 text-green-500  absolute top-4 right-5" />
                ) : (
                  <MdError className="w-5 h-5 text-yellow-500 absolute top-4 right-5" />
                )}
              </li>
            );
          })}
        </ul>
      </div>
      {selectedNotification && (
        <NotificationDetailModal
          closeModal={closeModal}
          isOpen={isModalOpen}
          fetchNotification={fetchNotification}
          selectedNotification={selectedNotification}
        />
      )}
    </div>
  );
}
