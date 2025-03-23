import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  InformationCircleIcon,
  XMarkIcon,
  AdjustmentsHorizontalIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../../context/AuthContext';
import {
  getUserNotifications,
  markAllNotificationsAsRead,
  markNotificationAsRead,
  UserNotification
} from '../../services/userProductsService';
import { useTheme } from '../../context/ThemeContext';
import {
  NotificationFilterType,
  getNotificationFilterPreference,
  saveNotificationFilterPreference
} from '../../services/userPreferencesService';

const Notifications = () => {
  const { user } = useAuth();
  const { isDarkMode } = useTheme();
  const [notifications, setNotifications] = useState<UserNotification[]>([]);
  const [filteredNotifications, setFilteredNotifications] = useState<UserNotification[]>([]);
  const [activeFilter, setActiveFilter] = useState<NotificationFilterType>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Load saved filter preference and notifications on mount
  useEffect(() => {
    if (user?.id) {
      // Load saved filter preference
      const savedFilter = getNotificationFilterPreference(user.id);
      setActiveFilter(savedFilter);

      // Load notifications
      fetchNotifications();
    }
  }, [user]);

  // Apply filters and search when dependencies change
  useEffect(() => {
    applyFiltersAndSearch();
  }, [notifications, activeFilter, searchTerm]);

  const fetchNotifications = () => {
    if (!user?.id) return;

    const userNotifications = getUserNotifications(user.id);
    setNotifications(userNotifications);
  };

  const applyFiltersAndSearch = () => {
    let filtered = notifications;

    // Apply type filter
    if (activeFilter === 'unread') {
      filtered = filtered.filter(n => !n.isRead);
    } else if (activeFilter !== 'all') {
      filtered = filtered.filter(n => n.type === activeFilter);
    }

    // Apply search term filter if it exists
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(n =>
        n.message.toLowerCase().includes(term) ||
        (n.productId && n.productId.toLowerCase().includes(term))
      );
    }

    setFilteredNotifications(filtered);
  };

  const handleNotificationClick = (notificationId: string) => {
    markNotificationAsRead(notificationId);
    fetchNotifications();
  };

  const markAllAsRead = () => {
    if (!user?.id) return;

    markAllNotificationsAsRead(user.id);
    fetchNotifications();
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const handleFilterChange = (filter: NotificationFilterType) => {
    setActiveFilter(filter);
    if (user?.id) {
      saveNotificationFilterPreference(user.id, filter);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const clearSearch = () => {
    setSearchTerm('');
  };

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

  const getFilterButtonClass = (filter: NotificationFilterType) => {
    const baseClass = 'px-3 py-1.5 text-sm font-medium rounded-md transition-colors';
    const activeClass = isDarkMode
      ? 'bg-blue-600 text-white'
      : 'bg-blue-500 text-white';
    const inactiveClass = isDarkMode
      ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
      : 'bg-gray-200 text-gray-700 hover:bg-gray-300';

    return `${baseClass} ${activeFilter === filter ? activeClass : inactiveClass}`;
  };

  const getFilterIndicator = (filter: NotificationFilterType) => {
    if (filter === 'all') return notifications.length;
    if (filter === 'unread') return notifications.filter(n => !n.isRead).length;
    return notifications.filter(n => n.type === filter).length;
  };

  return (
    <div className={`container max-w-4xl mx-auto px-4 py-8 ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Уведомления</h1>
        <div className="flex space-x-2">
          <button
            className={`p-2 rounded-md transition-colors ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}
            onClick={toggleFilters}
            aria-expanded={showFilters}
            title="Фильтры"
          >
            <AdjustmentsHorizontalIcon className="w-5 h-5" />
          </button>
          {notifications.some(n => !n.isRead) && (
            <button
              onClick={markAllAsRead}
              className={`px-3 py-1.5 text-sm font-medium rounded-md ${
                isDarkMode
                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                  : 'bg-blue-500 hover:bg-blue-600 text-white'
              } transition-colors`}
            >
              Прочитать все
            </button>
          )}
        </div>
      </div>

      {/* Search bar */}
      <div className={`relative mb-4 ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Поиск уведомлений..."
            className={`block w-full pl-10 pr-10 py-2 border ${
              isDarkMode
                ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
            } rounded-md focus:outline-none focus:ring-2 ${
              isDarkMode ? 'focus:ring-blue-500' : 'focus:ring-blue-500'
            } transition-colors`}
          />
          {searchTerm && (
            <button
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              onClick={clearSearch}
            >
              <XMarkIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
            </button>
          )}
        </div>
      </div>

      {/* Filters section */}
      <div className={`transition-all duration-300 overflow-hidden ${showFilters ? 'max-h-24 opacity-100 mb-4' : 'max-h-0 opacity-0'}`}>
        <div className="flex flex-wrap gap-2 py-2">
          <button
            className={getFilterButtonClass('all')}
            onClick={() => handleFilterChange('all')}
          >
            Все <span className="ml-1 px-1.5 py-0.5 text-xs rounded-full bg-opacity-20 bg-current">{getFilterIndicator('all')}</span>
          </button>
          <button
            className={getFilterButtonClass('unread')}
            onClick={() => handleFilterChange('unread')}
          >
            Непрочитанные <span className="ml-1 px-1.5 py-0.5 text-xs rounded-full bg-opacity-20 bg-current">{getFilterIndicator('unread')}</span>
          </button>
          <button
            className={getFilterButtonClass('success')}
            onClick={() => handleFilterChange('success')}
          >
            Успешно <span className="ml-1 px-1.5 py-0.5 text-xs rounded-full bg-opacity-20 bg-current">{getFilterIndicator('success')}</span>
          </button>
          <button
            className={getFilterButtonClass('warning')}
            onClick={() => handleFilterChange('warning')}
          >
            Предупреждения <span className="ml-1 px-1.5 py-0.5 text-xs rounded-full bg-opacity-20 bg-current">{getFilterIndicator('warning')}</span>
          </button>
          <button
            className={getFilterButtonClass('info')}
            onClick={() => handleFilterChange('info')}
          >
            Информация <span className="ml-1 px-1.5 py-0.5 text-xs rounded-full bg-opacity-20 bg-current">{getFilterIndicator('info')}</span>
          </button>
          <button
            className={getFilterButtonClass('error')}
            onClick={() => handleFilterChange('error')}
          >
            Ошибки <span className="ml-1 px-1.5 py-0.5 text-xs rounded-full bg-opacity-20 bg-current">{getFilterIndicator('error')}</span>
          </button>
        </div>
      </div>

      {/* Notifications List */}
      <div className={`rounded-lg overflow-hidden ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-md`}>
        {filteredNotifications.length === 0 ? (
          <div className="p-8 text-center">
            {searchTerm ? (
              <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Нет уведомлений, соответствующих вашему поиску
              </p>
            ) : activeFilter === 'all' ? (
              <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                У вас пока нет уведомлений
              </p>
            ) : (
              <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                У вас нет уведомлений по выбранному фильтру
              </p>
            )}
          </div>
        ) : (
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {filteredNotifications.map((notification) => (
              <li
                key={notification.id}
                className={`${
                  notification.isRead
                    ? isDarkMode ? 'bg-gray-800' : 'bg-white'
                    : isDarkMode ? 'bg-gray-700' : 'bg-blue-50'
                } transition-colors duration-150`}
              >
                {notification.link ? (
                  <Link
                    to={notification.link}
                    className={`block p-4 hover:${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'} transition-colors`}
                    onClick={() => handleNotificationClick(notification.id)}
                  >
                    <div className="flex">
                      <div className="flex-shrink-0 mr-4">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1">
                        <p className={`${isDarkMode ? 'text-gray-200' : 'text-gray-800'} mb-1`}>
                          {notification.message}
                        </p>
                        <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          {new Date(notification.created).toLocaleString()}
                        </p>
                      </div>
                      <div className="flex-shrink-0 self-center">
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </Link>
                ) : (
                  <div
                    className={`block p-4 hover:${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'} transition-colors cursor-pointer`}
                    onClick={() => handleNotificationClick(notification.id)}
                  >
                    <div className="flex">
                      <div className="flex-shrink-0 mr-4">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1">
                        <p className={`${isDarkMode ? 'text-gray-200' : 'text-gray-800'} mb-1`}>
                          {notification.message}
                        </p>
                        <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
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
    </div>
  );
};

export default Notifications;
