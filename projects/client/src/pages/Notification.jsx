import {useEffect, useState} from "react";
import {api} from "../API/api";
import {MdError, MdCheckCircle} from "react-icons/md";
import NotificationDetailModal from "../components/NotificationDetailModal";
import moment from "moment";
import {useDispatch} from "react-redux";
import Pagination from "../components/admin/Pagination";
import OrderSearch from "../components/admin/OrderSearch";

export default function Notification() {
  const [notifications, setNotifications] = useState([]);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(0); // Starting page is 0
  const [totalPages, setTotalPages] = useState(0);
  const [invoiceNumber, setInvoiceNumber] = useState("");

  const dispatch = useDispatch();

  useEffect(() => {
    fetchNotification();
  }, [currentPage, invoiceNumber]);

  const fetchNotification = async () => {
    try {
      let response = await api.get("/notification", {
        params: {
          userId: 2,
          page: currentPage,
          invoiceNumber: invoiceNumber,
        },
      });
      setNotifications(response.data.notif);
      setTotalPages(response.data.totalPages);
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSearch = (e) => {
    setInvoiceNumber(e.target.value);
    setCurrentPage(0);
    fetchNotification();
  };

  const handlePageChange = (selectedPage) => {
    setCurrentPage(selectedPage.selected);
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

  return (
    <div className="pt-24 cursor-default">
      <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
        Notifications
      </h1>
      <div className="max-w-[605px] mt-7 m-auto">
        <OrderSearch
          handleSearch={handleSearch}
          invoiceNumber={invoiceNumber}
        />
      </div>
      <div className="flex pt-6 min-h-[650px] justify-center">
        <ul
          role="list"
          className="flex flex-col gap-3 w-full sm:max-w-[605px] mx-auto">
          {notifications.map((notification) => {
            const readStatus =
              notification.UserNotifications.length > 0
                ? notification.UserNotifications[0].read
                : false;
            return (
              <li
                key={notification.id}
                onClick={(event) => openModal(notification.id, event)}
                className={`relative py-4 px-4 rounded-full w-full focus-within:ring-2 focus-within:ring-inset focus-within:ring-gray-600 ${
                  readStatus ? "bg-gray-50" : "bg-gray-200"
                } hover:bg-gray-100 hover:shadow-md`}>
                <div className="flex gap-10 items-center space-x-3">
                  <div className="min-w-0 flex-1">
                    <a href="#" className="block focus:outline-none">
                      <span
                        className="absolute inset-0"
                        aria-hidden="true"></span>
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
                  <MdCheckCircle className="w-5 h-5 text-green-500 absolute top-4 right-5" />
                ) : (
                  <MdError className="w-5 h-5 text-yellow-500 absolute top-4 right-5" />
                )}
              </li>
            );
          })}
        </ul>
      </div>
      <div className="-mt-12">
        <Pagination
          totalPages={totalPages}
          handlePageChange={handlePageChange}
        />
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
