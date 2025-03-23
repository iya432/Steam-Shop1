import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShoppingCartIcon,
  UserIcon,
  Bars3Icon,
  XMarkIcon,
  UserCircleIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  ChevronDownIcon,
  BellIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useTheme } from '../../context/ThemeContext';
import NotificationsPanel from '../NotificationsPanel';
import ThemeToggle from '../ThemeToggle';
import { getUnreadNotificationsCount } from '../../services/userProductsService';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileProfileOpen, setIsMobileProfileOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const { totalItems } = useCart();
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState(0);

  // Refs for keyboard navigation
  const userMenuRef = useRef<HTMLDivElement>(null);
  const userButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    // Check if user is admin
    const checkAdminStatus = () => {
      const adminUser = localStorage.getItem('admin_user');
      if (adminUser) {
        try {
          const parsedAdmin = JSON.parse(adminUser);
          setIsAdmin(parsedAdmin.isAuthenticated);
        } catch (error) {
          console.error('Failed to parse admin data', error);
          setIsAdmin(false);
        }
      } else {
        setIsAdmin(false);
      }
    };

    checkAdminStatus();

    // Get unread notifications count for badge
    if (user?.id) {
      const count = getUnreadNotificationsCount(user.id);
      setUnreadNotifications(count);
    }
  }, [user]);

  // Add a new function to close the menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const userMenu = document.getElementById("user-menu-container");
      if (userMenu && !userMenu.contains(event.target as Node) && isUserMenuOpen) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isUserMenuOpen]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    // When closing the mobile menu, also close any open mobile sections
    if (isMenuOpen) {
      setIsMobileProfileOpen(false);
    }
  };

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsUserMenuOpen(false);
  };

  // Update notification count
  const updateNotificationCount = () => {
    if (user?.id) {
      const count = getUnreadNotificationsCount(user.id);
      setUnreadNotifications(count);
    }
  };

  // Handle keyboard events for the dropdown button
  const handleUserMenuKeyDown = (event: React.KeyboardEvent) => {
    switch (event.key) {
      case 'Enter':
      case ' ':
        event.preventDefault();
        toggleUserMenu();
        break;
      case 'ArrowDown':
        if (isUserMenuOpen && userMenuRef.current) {
          event.preventDefault();
          const firstItem = userMenuRef.current.querySelector('a, button') as HTMLElement;
          if (firstItem) firstItem.focus();
        } else {
          toggleUserMenu();
        }
        break;
      case 'Escape':
        if (isUserMenuOpen) {
          event.preventDefault();
          setIsUserMenuOpen(false);
        }
        break;
    }
  };

  // Handle keyboard events for menu items
  const handleMenuItemKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      setIsUserMenuOpen(false);
      userButtonRef.current?.focus();
    }
  };

  // Toggle mobile profile section
  const toggleMobileProfile = () => {
    setIsMobileProfileOpen(!isMobileProfileOpen);
  };

  return (
    <header className={`${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-800 text-white'} py-4 shadow-md sticky top-0 z-50 transition-colors duration-200`}>
      <div className="container mx-auto px-4 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <svg
            className="w-8 h-8 text-blue-500"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 496 512"
          >
            <path d="M496 256c0 137-111.2 248-248.4 248-113.8 0-209.6-76.3-239-180.4l95.2 39.3c6.4 32.1 34.9 56.4 68.9 56.4 39.2 0 71.9-32.4 70.2-73.5l84.5-60.2c52.1 1.3 95.8-40.9 95.8-93.5 0-51.6-42-93.5-93.7-93.5s-93.7 42-93.7 93.5v1.2L176.6 279c-15.5-.9-30.7 3.4-43.5 12.1L0 236.1C10.2 108.4 117.1 8 247.6 8 384.8 8 496 119 496 256zM155.7 384.3l-30.5-12.6a52.79 52.79 0 0 0 27.2 25.8c26.9 11.2 57.8-1.6 69-28.4 5.4-13 5.5-27.3.1-40.3-5.4-13-15.5-23.2-28.5-28.6-12.9-5.4-26.7-5.2-38.9-.6l31.5 13c19.8 8.2 29.2 30.9 20.9 50.7-8.3 19.9-31 29.2-50.8 21zm173.8-129.9c-34.4 0-62.4-28-62.4-62.3s28-62.3 62.4-62.3 62.4 28 62.4 62.3-27.9 62.3-62.4 62.3zm.1-15.6c25.9 0 46.9-21 46.9-46.8 0-25.9-21-46.8-46.9-46.8s-46.9 21-46.9 46.8c.1 25.8 21.1 46.8 46.9 46.8z" />
          </svg>
          <span className="text-xl font-bold">Steam Shop</span>
        </Link>

        {/* Desktop Navigation Menu */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link to="/accounts" className="hover:text-blue-400 transition-colors">
            Аккаунты Steam
          </Link>
          <Link to="/balance" className="hover:text-blue-400 transition-colors">
            Пополнение баланса
          </Link>
          <Link to="/games" className="hover:text-blue-400 transition-colors">
            Игры и ключи
          </Link>
          <Link to="/faq" className="hover:text-blue-400 transition-colors">
            FAQ
          </Link>
        </nav>

        {/* User & Cart */}
        <div className="flex items-center gap-4">
          {/* Theme Toggle */}
          <ThemeToggle />

          {/* Shopping Cart */}
          <Link to="/cart" className="relative">
            <ShoppingCartIcon className="h-6 w-6 text-gray-300 hover:text-white transition-colors" />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 flex items-center justify-center text-white text-xs">
                {totalItems}
              </span>
            )}
          </Link>

          {/* Notifications (only for authenticated users) */}
          {user && (
            <div onMouseLeave={updateNotificationCount}>
              <NotificationsPanel userId={user.id} />
            </div>
          )}

          {/* User dropdown */}
          <div className="relative" id="user-menu-container">
            <button
              ref={userButtonRef}
              className={`flex items-center space-x-1 p-1.5 rounded-full ${
                isUserMenuOpen
                  ? isDarkMode
                    ? 'bg-gray-700 text-white'
                    : 'bg-gray-600 text-white'
                  : 'text-gray-300 hover:text-white'
              } transition-colors duration-200`}
              onClick={toggleUserMenu}
              onKeyDown={handleUserMenuKeyDown}
              aria-expanded={isUserMenuOpen}
              aria-haspopup="true"
              tabIndex={0}
            >
              {user?.avatar ? (
                <img src={user.avatar} alt="Profile" className={`w-7 h-7 rounded-full ${isUserMenuOpen ? 'ring-2 ring-blue-400' : ''}`} />
              ) : (
                <UserIcon className="h-6 w-6" />
              )}
              <ChevronDownIcon className={`h-4 w-4 transition-transform duration-200 ${isUserMenuOpen ? 'rotate-180' : ''}`} />

              {/* Notification badge on profile icon */}
              {user && unreadNotifications > 0 && (
                <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-white text-xs font-bold flex items-center justify-center">
                  {unreadNotifications > 9 ? '9+' : unreadNotifications}
                </span>
              )}
            </button>

            {/* Dropdown - with animation */}
            <div
              ref={userMenuRef}
              className={`absolute right-0 w-56 py-2 mt-2 ${
                isDarkMode ? 'bg-gray-800 text-gray-100' : 'bg-white text-gray-800'
              } rounded-md shadow-xl z-10 transform transition-all duration-200 ease-in-out origin-top-right overflow-hidden ${
                isUserMenuOpen
                ? 'opacity-100 translate-y-0 max-h-96'
                : 'opacity-0 -translate-y-4 max-h-0 pointer-events-none'
              }`}
              role="menu"
              aria-orientation="vertical"
              aria-labelledby="user-menu-button"
            >
              {user ? (
                <>
                  <div className={`px-4 py-3 text-sm border-b ${isDarkMode ? 'border-gray-700 text-gray-200' : 'border-gray-200 text-gray-700'}`}>
                    <div className="font-medium truncate">{user.username || 'Пользователь'}</div>
                    <div className={`text-xs truncate ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{user.email}</div>
                  </div>
                  <Link
                    to="/profile"
                    className={`flex items-center px-4 py-2 text-sm ${
                      isDarkMode
                        ? 'hover:bg-gray-700 text-gray-200'
                        : 'hover:bg-gray-100 text-gray-700'
                    } transition-colors duration-150`}
                    onClick={() => setIsUserMenuOpen(false)}
                    onKeyDown={handleMenuItemKeyDown}
                    role="menuitem"
                    tabIndex={0}
                  >
                    <UserCircleIcon className="h-4 w-4 mr-2" />
                    Профиль
                  </Link>
                  <Link
                    to="/profile/products"
                    className={`flex items-center px-4 py-2 text-sm ${
                      isDarkMode
                        ? 'hover:bg-gray-700 text-gray-200'
                        : 'hover:bg-gray-100 text-gray-700'
                    } transition-colors duration-150`}
                    onClick={() => setIsUserMenuOpen(false)}
                    onKeyDown={handleMenuItemKeyDown}
                    role="menuitem"
                    tabIndex={0}
                  >
                    <Cog6ToothIcon className="h-4 w-4 mr-2" />
                    Мои товары
                  </Link>
                  <Link
                    to="/profile/notifications"
                    className={`flex items-center justify-between px-4 py-2 text-sm ${
                      isDarkMode
                        ? 'hover:bg-gray-700 text-gray-200'
                        : 'hover:bg-gray-100 text-gray-700'
                    } transition-colors duration-150`}
                    onClick={() => setIsUserMenuOpen(false)}
                    onKeyDown={handleMenuItemKeyDown}
                    role="menuitem"
                    tabIndex={0}
                  >
                    <div className="flex items-center">
                      <BellIcon className="h-4 w-4 mr-2" />
                      <span>Уведомления</span>
                    </div>
                    {unreadNotifications > 0 && (
                      <span className="ml-2 px-1.5 py-0.5 bg-red-500 text-white text-xs rounded-full">
                        {unreadNotifications}
                      </span>
                    )}
                  </Link>
                  {/* Admin Panel link (only show for admins) */}
                  {isAdmin && (
                    <Link
                      to="/admin"
                      className={`flex items-center px-4 py-2 text-sm ${
                        isDarkMode
                          ? 'text-purple-400 hover:bg-gray-700'
                          : 'text-purple-700 hover:bg-gray-100'
                      } transition-colors duration-150`}
                      onClick={() => setIsUserMenuOpen(false)}
                      onKeyDown={handleMenuItemKeyDown}
                      role="menuitem"
                      tabIndex={0}
                    >
                      <Cog6ToothIcon className="h-4 w-4 mr-2" />
                      Панель администратора
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    onKeyDown={handleMenuItemKeyDown}
                    className={`flex w-full items-center px-4 py-2 text-sm ${
                      isDarkMode
                        ? 'text-red-400 hover:bg-gray-700'
                        : 'text-red-700 hover:bg-gray-100'
                    } transition-colors duration-150`}
                    role="menuitem"
                    tabIndex={0}
                  >
                    <ArrowRightOnRectangleIcon className="h-4 w-4 mr-2" />
                    Выйти
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className={`block px-4 py-2 text-sm ${
                      isDarkMode
                        ? 'hover:bg-gray-700 text-gray-200'
                        : 'hover:bg-gray-100 text-gray-700'
                    } transition-colors duration-150`}
                    onClick={() => setIsUserMenuOpen(false)}
                    onKeyDown={handleMenuItemKeyDown}
                    role="menuitem"
                    tabIndex={0}
                  >
                    Войти
                  </Link>
                  <Link
                    to="/register"
                    className={`block px-4 py-2 text-sm ${
                      isDarkMode
                        ? 'hover:bg-gray-700 text-gray-200'
                        : 'hover:bg-gray-100 text-gray-700'
                    } transition-colors duration-150`}
                    onClick={() => setIsUserMenuOpen(false)}
                    onKeyDown={handleMenuItemKeyDown}
                    role="menuitem"
                    tabIndex={0}
                  >
                    Регистрация
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 rounded-md hover:bg-gray-700 transition-colors"
          onClick={toggleMenu}
          aria-expanded={isMenuOpen}
          aria-controls="mobile-menu"
        >
          {isMenuOpen ? (
            <XMarkIcon className="w-6 h-6" />
          ) : (
            <Bars3Icon className="w-6 h-6" />
          )}
        </button>
      </div>

      {/* Mobile Menu with improved collapsible sections */}
      <div
        id="mobile-menu"
        className={`md:hidden bg-gray-800 overflow-hidden transition-all duration-300 ease-in-out ${
          isMenuOpen
            ? 'max-h-screen opacity-100'
            : 'max-h-0 opacity-0'
        }`}
      >
        <div className="container mx-auto px-4">
          {/* Navigation Links */}
          <div className="py-3 space-y-3">
            <Link
              to="/accounts"
              className="block hover:text-blue-400 transition-colors py-2"
              onClick={toggleMenu}
            >
              Аккаунты Steam
            </Link>
            <Link
              to="/balance"
              className="block hover:text-blue-400 transition-colors py-2"
              onClick={toggleMenu}
            >
              Пополнение баланса
            </Link>
            <Link
              to="/games"
              className="block hover:text-blue-400 transition-colors py-2"
              onClick={toggleMenu}
            >
              Игры и ключи
            </Link>
            <Link
              to="/faq"
              className="block hover:text-blue-400 transition-colors py-2"
              onClick={toggleMenu}
            >
              FAQ
            </Link>
          </div>

          {/* User Profile section in mobile menu - Collapsible */}
          {user && (
            <div className="border-t border-gray-700 pt-2">
              <button
                className="w-full flex items-center justify-between py-3 px-1"
                onClick={toggleMobileProfile}
                aria-expanded={isMobileProfileOpen}
              >
                <div className="flex items-center">
                  {user.avatar ? (
                    <img src={user.avatar} alt="Profile" className="w-8 h-8 rounded-full mr-3" />
                  ) : (
                    <UserIcon className="h-6 w-6 mr-3" />
                  )}
                  <div className="text-left">
                    <div className="text-sm font-medium">{user.username || 'Пользователь'}</div>
                    <div className="text-xs text-gray-400 truncate max-w-[200px]">{user.email}</div>
                  </div>
                </div>
                <ChevronDownIcon
                  className={`h-5 w-5 text-gray-400 transition-transform duration-200 ${isMobileProfileOpen ? 'rotate-180' : ''}`}
                />
              </button>

              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  isMobileProfileOpen ? 'max-h-80' : 'max-h-0'
                }`}
              >
                <div className="px-1 pb-3 space-y-3">
                  <Link
                    to="/profile"
                    className="flex items-center py-2 text-sm hover:text-blue-400 transition-colors"
                    onClick={toggleMenu}
                  >
                    <UserCircleIcon className="h-5 w-5 mr-2" />
                    Профиль
                  </Link>
                  <Link
                    to="/profile/products"
                    className="flex items-center py-2 text-sm hover:text-blue-400 transition-colors"
                    onClick={toggleMenu}
                  >
                    <Cog6ToothIcon className="h-5 w-5 mr-2" />
                    Мои товары
                  </Link>
                  <Link
                    to="/profile/notifications"
                    className="flex items-center justify-between py-2 text-sm hover:text-blue-400 transition-colors"
                    onClick={toggleMenu}
                  >
                    <div className="flex items-center">
                      <BellIcon className="h-5 w-5 mr-2" />
                      <span>Уведомления</span>
                    </div>
                    {unreadNotifications > 0 && (
                      <span className="px-1.5 py-0.5 bg-red-500 text-white text-xs rounded-full">
                        {unreadNotifications}
                      </span>
                    )}
                  </Link>

                  {/* Admin Panel link in mobile menu */}
                  {isAdmin && (
                    <Link
                      to="/admin"
                      className="flex items-center py-2 text-sm text-purple-400 hover:text-purple-300 transition-colors"
                      onClick={toggleMenu}
                    >
                      <Cog6ToothIcon className="h-5 w-5 mr-2" />
                      Панель администратора
                    </Link>
                  )}

                  <button
                    onClick={() => {
                      handleLogout();
                      toggleMenu();
                    }}
                    className="flex w-full items-center py-2 text-sm text-red-400 hover:text-red-300 transition-colors"
                  >
                    <ArrowRightOnRectangleIcon className="h-5 w-5 mr-2" />
                    Выйти
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Login/Register for non-authenticated users */}
          {!user && (
            <div className="border-t border-gray-700 py-3 space-y-3">
              <Link
                to="/login"
                className="flex items-center py-2 hover:text-blue-400 transition-colors"
                onClick={toggleMenu}
              >
                <ArrowRightOnRectangleIcon className="h-5 w-5 mr-2" />
                Войти
              </Link>
              <Link
                to="/register"
                className="flex items-center py-2 hover:text-blue-400 transition-colors"
                onClick={toggleMenu}
              >
                <UserCircleIcon className="h-5 w-5 mr-2" />
                Регистрация
              </Link>
            </div>
          )}

          {/* Theme Toggle in mobile menu */}
          <div className="border-t border-gray-700 py-4 flex justify-between items-center">
            <span className="text-sm">Переключить тему</span>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
