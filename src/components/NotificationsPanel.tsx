import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  BellIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  InformationCircleIcon,
  XMarkIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';
import {
  getUserNotifications,
  getUnreadNotificationsCount,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  UserNotification
} from '../services/userProductsService';

interface NotificationsPanelProps {
  userId: string;
}

const NotificationsPanel: React.FC<NotificationsPanelProps> = ({ userId }) => {
  const [notifications, setNotifications] = useState<UserNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  // Fetch notifications on component mount and when userId changes
  useEffect(() => {
    if (userId) {
      fetchNotifications();
    }
  }, [userId]);

  // Fetch notifications
  const fetchNotifications = () => {
    const userNotifications = getUserNotifications(userId);
    setNotifications(userNotifications.slice(0, 5)); // Only show latest 5 notifications
    setUnreadCount(getUnreadNotificationsCount(userId));
  };

  // Toggle notifications panel
  const togglePanel = () => {
    setIsOpen(!isOpen);
    if (!isOpen && unreadCount > 0) {
      // Mark all as read when opening with unread notifications
      markAllAsRead();
    }
  };

  // Handle notification click
  const handleNotificationClick = (notificationId: string) => {
    markNotificationAsRead(notificationId);
    fetchNotifications();
  };

  // Mark all notifications as read
  const markAllAsRead = () => {
    markAllNotificationsAsRead(userId);
    fetchNotifications();
  };

  // Get icon based on notification type
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircleIcon className="w-5 h-5 text-green-500" />;
      case 'warning':
        return <ExclamationCircleIcon className="w-5 h-5 text-yellow-500" />;
      case 'error':
        return <XMarkIcon className="w-5 h-5 text-red-500" />;
      case 'info':
      default:
        return <InformationCircleIcon className="w-5 h-5 text-blue-500" />;
    }
  };

  return (
    <div className="relative">
      {/* Notification Bell */}
      <button
        className={`relative p-2 rounded-full ${isOpen ? 'bg-gray-700 text-white' : 'text-gray-300 hover:text-white'} transition-colors duration-200`}
        onClick={togglePanel}
        aria-label="Уведомления"
      >
        <BellIcon className="w-6 h-6" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 block h-4 w-4 rounded-full bg-red-500 text-white text-xs font-bold flex items-center justify-center animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Notifications Panel with animation */}
      <div
        className={`absolute right-0 mt-2 w-80 md:w-96 bg-white rounded-md shadow-lg z-10 overflow-hidden transform transition-all duration-200 ease-in-out origin-top-right ${
          isOpen
          ? 'opacity-100 translate-y-0 max-h-[32rem]'
          : 'opacity-0 -translate-y-4 max-h-0 pointer-events-none'
        }`}
      >
        <div className="p-3 border-b flex justify-between items-center bg-gray-50">
          <h3 className="font-medium">Уведомления</h3>
          <div className="flex space-x-3">
            {notifications.length > 0 && (
              <button
                className="text-sm text-blue-500 hover:text-blue-700 transition-colors"
                onClick={markAllAsRead}
              >
                Прочитать все
              </button>
            )}
            <Link
              to="/profile/notifications"
              className="text-sm text-blue-500 hover:text-blue-700 transition-colors flex items-center"
              onClick={() => setIsOpen(false)}
            >
              <span>Все уведомления</span>
              <ArrowRightIcon className="w-3 h-3 ml-1" />
            </Link>
          </div>
        </div>

        <div className="max-h-80 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              У вас нет уведомлений
            </div>
          ) : (
            <ul>
              {notifications.map((notification) => (
                <li
                  key={notification.id}
                  className={`border-b last:border-b-0 transition-colors duration-150 ${notification.isRead ? 'bg-white' : 'bg-blue-50'}`}
                >
                  {notification.link ? (
                    <Link
                      to={notification.link}
                      className="block p-3 hover:bg-gray-50 transition-colors"
                      onClick={() => handleNotificationClick(notification.id)}
                    >
                      <div className="flex">
                        <div className="flex-shrink-0 mr-3">
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div>
                          <p className="text-sm text-gray-800">{notification.message}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(notification.created).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </Link>
                  ) : (
                    <div
                      className="block p-3 hover:bg-gray-50 transition-colors cursor-pointer"
                      onClick={() => handleNotificationClick(notification.id)}
                    >
                      <div className="flex">
                        <div className="flex-shrink-0 mr-3">
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-gray-800">{notification.message}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(notification.created).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="p-2 bg-gray-50 border-t text-center">
          <Link
            to="/profile/notifications"
            className="text-sm text-blue-600 hover:text-blue-800 block py-1 transition-colors"
            onClick={() => setIsOpen(false)}
          >
            Посмотреть все уведомления
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotificationsPanel;
