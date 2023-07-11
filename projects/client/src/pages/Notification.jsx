import {useEffect, useState, useRef} from "react";
import {api} from "../API/api";
import {MdError, MdCheckCircle} from "react-icons/md";
import NotificationDetailModal from "../components/NotificationDetailModal";
import moment from "moment";
import {useDispatch} from "react-redux";
import {unreadCount} from "../features/notificationSlice";
import io from "socket.io-client";

export default function Notification() {
  const [notifications, setNotifications] = useState([]);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showAll, setShowAll] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    const socket = io("http://localhost:8000");
    socket.on("notificationUpdate", (updatedNotifications) => {
      console.log("ini update from socet", updatedNotifications);
      setNotifications(updatedNotifications);
      // Update unread count here if needed
      const unread = updatedNotifications.filter((notification) => {
        return (
          notification.UserNotifications.length === 0 ||
          !notification.UserNotifications[0].read
        );
      });
      dispatch(unreadCount({unread: unread.length}));
    });

    return () => {
      socket.off("notificationUpdate");
    };
  }, []);

  useEffect(() => {
    fetchNotification();
  }, [showAll]);

  const fetchNotification = async () => {
    try {
      let response = await api.get("/notification", {
        params: {
          userId: 2,
          showAll: showAll,
        },
      });

      setNotifications(response.data.notif);
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

  const openModal = (notificationId, event) => {
    event.preventDefault();
    setSelectedNotification(notificationId);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedNotification(null);
    setIsModalOpen(false);
  };

  const handleSeeAll = () => {
    setShowAll(true);
  };

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
                onClick={(event) => openModal(notification.id, event)}
                className={`relative py-4 px-4 rounded-full w-[650px] md:w-full sm:w-full focus-within:ring-2 focus-within:ring-inset focus-within:ring-gray-600  ${
                  readStatus ? "bg-gray-50" : "bg-gray-200"
                } hover:bg-gray-100 hover:shadow-md`}>
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
                    {moment(notification.createdAt).format(
                      "MMMM Do YYYY, h:mm:ss a"
                    )}
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
      {!showAll && (
        <button
          onClick={handleSeeAll}
          className="mt-4 mb-8 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2 px-4 rounded-lg focus:outline-none">
          See All
        </button>
      )}
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
