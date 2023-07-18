import { EnvelopeIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import { useEffect } from "react";
import { api } from "../API/api";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function NotificationDetailModal({
  fetchNotification,
  selectedNotification,
  closeModal,
  isOpen,
}) {
  const [notification, setNotification] = useState([]);

  const fetchNotificationDetail = async (id) => {
    try {
      const response = await api.get(`/notification/${id}/detail`);
      const { notify } = response.data;
      setNotification(notify);
    } catch (error) {
      console.error(error);
    }
  };

  const createReadNotification = async () => {
    try {
      const response = await api.post(`/notification/admin`, {
        notificationId: selectedNotification,
        userId: 2,
      });
      fetchNotification();
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (isOpen && selectedNotification) {
      fetchNotificationDetail(selectedNotification);
      createReadNotification();
    }
  }, [isOpen, selectedNotification]);

  const handleOverlayClick = (e) => {
    const isModalContentClicked = e.target.closest(".modal-content");
    if (!isModalContentClicked) {
      closeModal();
    }
  };

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 m-auto flex items-center justify-center z-400">
          <div
            className="absolute inset-0 bg-gray-900 bg-opacity-50"
            onClick={handleOverlayClick}
          />
          <div className="relative bg-white p-6 rounded-xl max-w-2xl mx-auto">
            <div className="flex items-center justify-center">
              <span className="rounded-lg inline-flex p-3 ring-4 m-auto ring-white">
                <EnvelopeIcon className="h-6 w-6" aria-hidden="true" />
              </span>
            </div>
            <div>
              {notification.map((notify) => (
                <div key={notify.id} className="mt-2">
                  <h3 className="text-lg font-medium">
                    <p className="focus:outline-none">
                      <span className="absolute inset-0" aria-hidden="true" />
                      {notify.title}
                    </p>
                  </h3>
                  <p className="mt-2 text-sm text-gray-500">{notify.message}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
