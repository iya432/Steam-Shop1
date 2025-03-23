import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  UserCircleIcon,
  EnvelopeIcon,
  KeyIcon,
  ShoppingBagIcon,
  ArrowRightOnRectangleIcon,
  TagIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../../context/AuthContext';
import { getUserPurchaseHistory, PurchaseHistoryItem } from '../../services/accountsService';

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'profile' | 'purchases' | 'products'>('profile');

  // Get user purchase history from the mock service
  const purchaseHistory = getUserPurchaseHistory();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Format date for display
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  // If user is not authenticated, they shouldn't be on this page
  if (!user) {
    navigate('/login', { state: { from: '/profile' } });
    return null;
  }

  return (
    <div className="bg-gray-100 py-8 min-h-screen">
      <div className="container mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Header */}
          <div className="bg-blue-600 text-white py-6 px-6">
            <div className="flex items-center space-x-4">
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.username}
                  className="w-16 h-16 rounded-full border-2 border-white"
                />
              ) : (
                <UserCircleIcon className="w-16 h-16" />
              )}
              <div>
                <h1 className="text-2xl font-bold">{user.username}</h1>
                <p className="text-blue-100">ID: {user.id}</p>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="bg-gray-100 border-b border-gray-200">
            <div className="container mx-auto flex">
              <button
                className={`px-6 py-3 font-medium ${
                  activeTab === 'profile'
                    ? 'bg-white border-t-2 border-blue-500 text-blue-600'
                    : 'text-gray-600 hover:text-blue-500'
                }`}
                onClick={() => setActiveTab('profile')}
              >
                Профиль
              </button>
              <button
                className={`px-6 py-3 font-medium ${
                  activeTab === 'purchases'
                    ? 'bg-white border-t-2 border-blue-500 text-blue-600'
                    : 'text-gray-600 hover:text-blue-500'
                }`}
                onClick={() => setActiveTab('purchases')}
              >
                История покупок
              </button>
              <button
                className={`px-6 py-3 font-medium ${
                  activeTab === 'products'
                    ? 'bg-white border-t-2 border-blue-500 text-blue-600'
                    : 'text-gray-600 hover:text-blue-500'
                }`}
                onClick={() => navigate('/profile/products')}
              >
                Мои товары
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {activeTab === 'profile' ? (
              // Profile Tab Content
              <div className="max-w-2xl mx-auto">
                <h2 className="text-xl font-bold mb-6">Информация аккаунта</h2>

                {/* User Info */}
                <div className="bg-gray-50 rounded-lg p-6 mb-6">
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <UserCircleIcon className="w-6 h-6 text-gray-500 mt-0.5" />
                      <div>
                        <h3 className="font-medium">Имя пользователя</h3>
                        <p className="text-gray-700">{user.username}</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <EnvelopeIcon className="w-6 h-6 text-gray-500 mt-0.5" />
                      <div>
                        <h3 className="font-medium">Email</h3>
                        <p className="text-gray-700">{user.email}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Account Actions */}
                <h2 className="text-xl font-bold mb-4">Действия</h2>
                <div className="space-y-4">
                  <button
                    className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                    onClick={() => navigate('/profile/change-password')}
                  >
                    <div className="flex items-center space-x-3">
                      <KeyIcon className="w-6 h-6 text-gray-500" />
                      <span className="font-medium">Изменить пароль</span>
                    </div>
                    <span className="text-blue-500">→</span>
                  </button>

                  <button
                    className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                    onClick={() => setActiveTab('purchases')}
                  >
                    <div className="flex items-center space-x-3">
                      <ShoppingBagIcon className="w-6 h-6 text-gray-500" />
                      <span className="font-medium">История покупок</span>
                    </div>
                    <span className="text-blue-500">→</span>
                  </button>

                  <Link
                    to="/profile/products"
                    className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <TagIcon className="w-6 h-6 text-gray-500" />
                      <span className="font-medium">Управление моими товарами</span>
                    </div>
                    <span className="text-blue-500">→</span>
                  </Link>

                  <button
                    className="w-full flex items-center justify-between p-4 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                    onClick={handleLogout}
                  >
                    <div className="flex items-center space-x-3">
                      <ArrowRightOnRectangleIcon className="w-6 h-6 text-red-500" />
                      <span className="font-medium text-red-600">Выйти из аккаунта</span>
                    </div>
                    <span className="text-red-500">→</span>
                  </button>
                </div>
              </div>
            ) : (
              // Purchase History Tab Content
              <div>
                <h2 className="text-xl font-bold mb-6">История покупок</h2>

                {purchaseHistory.length > 0 ? (
                  <div className="space-y-6">
                    {purchaseHistory.map((purchase: PurchaseHistoryItem) => (
                      <div key={purchase.id} className="bg-gray-50 rounded-lg overflow-hidden shadow-sm">
                        {/* Purchase Header */}
                        <div className="bg-gray-100 p-4 border-b border-gray-200">
                          <div className="flex justify-between items-center">
                            <div>
                              <span className="font-medium">Заказ #{purchase.id}</span>
                              <p className="text-sm text-gray-500">
                                {formatDate(purchase.date)}
                              </p>
                            </div>
                            <div className="text-right">
                              <span
                                className={`inline-block px-3 py-1 text-xs rounded-full font-medium ${
                                  purchase.status === 'completed'
                                    ? 'bg-green-100 text-green-800'
                                    : purchase.status === 'processing'
                                    ? 'bg-yellow-100 text-yellow-800'
                                    : 'bg-red-100 text-red-800'
                                }`}
                              >
                                {purchase.status === 'completed'
                                  ? 'Завершен'
                                  : purchase.status === 'processing'
                                  ? 'В обработке'
                                  : 'Ошибка'}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Purchase Items */}
                        <div className="p-4">
                          <div className="space-y-3">
                            {purchase.items.map((item, index) => (
                              <div key={index} className="flex justify-between py-2 border-b border-gray-100 last:border-0">
                                <div>
                                  <p className="font-medium">{item.title}</p>
                                  <p className="text-sm text-gray-500">
                                    {item.type === 'account'
                                      ? 'Аккаунт'
                                      : item.type === 'balance'
                                      ? 'Пополнение баланса'
                                      : 'Игра'}
                                  </p>
                                </div>
                                <div className="text-right">
                                  <p className="font-medium">{item.price} ₽</p>
                                  <p className="text-sm text-gray-500">x{item.quantity}</p>
                                </div>
                              </div>
                            ))}
                          </div>

                          {/* Purchase Total */}
                          <div className="mt-4 pt-3 border-t border-gray-200 flex justify-between">
                            <span className="font-bold">Итого:</span>
                            <span className="font-bold">{purchase.totalAmount} ₽</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-gray-50 rounded-lg p-8 text-center">
                    <ShoppingBagIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-bold mb-2">У вас еще нет покупок</h3>
                    <p className="text-gray-600 mb-6">
                      Когда вы сделаете покупку, она появится здесь.
                    </p>
                    <button
                      onClick={() => navigate('/accounts')}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md transition-colors"
                    >
                      Посмотреть аккаунты
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
