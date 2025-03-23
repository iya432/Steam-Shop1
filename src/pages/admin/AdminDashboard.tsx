import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getAdminStats, moderateProduct, clearAllTransactions } from '../../services/adminService';
import { UserProduct, clearPendingProducts, resetAllProductsStatus } from '../../services/userProductsService';
import {
  CheckIcon,
  XMarkIcon,
  ExclamationTriangleIcon,
  ArrowPathIcon,
  TrashIcon
} from '@heroicons/react/24/outline';

interface AdminUser {
  email: string;
  username: string;
  role: 'admin' | 'moderator' | 'support';
  isAuthenticated: boolean;
}

interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  pendingProducts: number;
  totalProducts: number;
  totalSales: number;
  totalRevenue: number;
  recentTransactions: any[];
  pendingModeration: UserProduct[];
}

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState<AdminStats | null>(null);

  // Загрузка данных админ-панели
  const loadAdminData = () => {
    setRefreshing(true);
    try {
      const adminStats = getAdminStats();
      setStats(adminStats);
    } catch (error) {
      console.error('Error loading admin stats:', error);
    } finally {
      setRefreshing(false);
    }
  };

  // Функция очистки временных данных
  const clearTemporaryData = () => {
    if (window.confirm('Вы уверены, что хотите очистить все временные данные? Это удалит все товары на модерации и сбросит статистику.')) {
      try {
        // Очистка транзакций
        clearAllTransactions();

        // Очистка товаров на модерации
        clearPendingProducts();

        // Сбросим статус всех товаров на активный
        resetAllProductsStatus();

        // Перезагрузим данные админ-панели
        loadAdminData();

        alert('Временные данные успешно очищены.');
      } catch (error) {
        console.error('Error clearing temporary data:', error);
        alert('Произошла ошибка при очистке данных.');
      }
    }
  };

  useEffect(() => {
    // Check if user is logged in as admin
    const storedAdmin = localStorage.getItem('admin_user');

    if (!storedAdmin) {
      navigate('/adminpaneel');
      return;
    }

    try {
      const parsedAdmin = JSON.parse(storedAdmin);
      if (!parsedAdmin || !parsedAdmin.isAuthenticated) {
        navigate('/adminpaneel');
        return;
      }

      setAdminUser(parsedAdmin);
      // Fetch admin stats
      loadAdminData();
    } catch (error) {
      console.error('Failed to parse admin user data', error);
      navigate('/adminpaneel');
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  // Обработчики для кнопок одобрения и отклонения товаров
  const handleApproveProduct = (productId: string) => {
    if (!adminUser) return;

    // Вызываем функцию модерации товара
    const success = moderateProduct(productId, 'approve', adminUser.username);

    if (success) {
      // Перезагружаем данные админ-панели
      loadAdminData();
    }
  };

  const handleRejectProduct = (productId: string) => {
    if (!adminUser) return;

    // Вызываем функцию модерации товара
    const success = moderateProduct(productId, 'reject', adminUser.username);

    if (success) {
      // Перезагружаем данные админ-панели
      loadAdminData();
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_user');
    navigate('/adminpaneel');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-xl text-gray-600">Загрузка...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Панель администратора</h1>
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-600">
              <span className="font-medium">{adminUser?.username}</span> ({adminUser?.role})
            </div>
            <button
              onClick={handleLogout}
              className="px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm"
            >
              Выход
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Stats cards */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-sm font-medium text-gray-500">Всего пользователей</h3>
            <p className="text-3xl font-bold text-gray-900 mt-2">{stats?.totalUsers || 0}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-sm font-medium text-gray-500">Активных пользователей</h3>
            <p className="text-3xl font-bold text-gray-900 mt-2">{stats?.activeUsers || 0}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-sm font-medium text-gray-500">Всего товаров</h3>
            <p className="text-3xl font-bold text-gray-900 mt-2">{stats?.totalProducts || 0}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-sm font-medium text-gray-500">Всего продаж</h3>
            <p className="text-3xl font-bold text-gray-900 mt-2">{stats?.totalSales || 0}</p>
          </div>
        </div>

        {/* Admin Navigation Shortcuts */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-8">
          <div className="px-6 py-4 border-b flex justify-between items-center">
            <h2 className="text-lg font-medium text-gray-900">Управление сайтом</h2>
            <button
              onClick={clearTemporaryData}
              className="px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm flex items-center"
            >
              <TrashIcon className="h-4 w-4 mr-2" />
              Очистить временные данные
            </button>
          </div>
          <div className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <Link to="/admin/products" className="bg-blue-50 p-4 rounded-lg hover:bg-blue-100 flex flex-col items-center text-center">
              <div className="text-blue-600 text-2xl mb-2">🛒</div>
              <div className="font-medium text-gray-900">Товары</div>
              <div className="text-sm text-gray-500">Управление всеми товарами</div>
            </Link>
            <Link to="/admin/products/add" className="bg-green-50 p-4 rounded-lg hover:bg-green-100 flex flex-col items-center text-center">
              <div className="text-green-600 text-2xl mb-2">➕</div>
              <div className="font-medium text-gray-900">Добавить товар</div>
              <div className="text-sm text-gray-500">Создать новый товар</div>
            </Link>
            <Link to="/admin/categories" className="bg-purple-50 p-4 rounded-lg hover:bg-purple-100 flex flex-col items-center text-center">
              <div className="text-purple-600 text-2xl mb-2">📋</div>
              <div className="font-medium text-gray-900">Категории</div>
              <div className="text-sm text-gray-500">Управление категориями</div>
            </Link>
            <Link to="/admin/users" className="bg-yellow-50 p-4 rounded-lg hover:bg-yellow-100 flex flex-col items-center text-center">
              <div className="text-yellow-600 text-2xl mb-2">👥</div>
              <div className="font-medium text-gray-900">Пользователи</div>
              <div className="text-sm text-gray-500">Управление аккаунтами</div>
            </Link>
            <Link to="/admin/user-credentials" className="bg-red-50 p-4 rounded-lg hover:bg-red-100 flex flex-col items-center text-center">
              <div className="text-red-600 text-2xl mb-2">🔐</div>
              <div className="font-medium text-gray-900">Учетные данные</div>
              <div className="text-sm text-gray-500">Пароли и доступы</div>
            </Link>
            <Link to="/admin/site-settings" className="bg-indigo-50 p-4 rounded-lg hover:bg-indigo-100 flex flex-col items-center text-center">
              <div className="text-indigo-600 text-2xl mb-2">⚙️</div>
              <div className="font-medium text-gray-900">Настройки сайта</div>
              <div className="text-sm text-gray-500">Дизайн и содержимое</div>
            </Link>
            <Link to="/admin/settings" className="bg-gray-50 p-4 rounded-lg hover:bg-gray-100 flex flex-col items-center text-center">
              <div className="text-gray-600 text-2xl mb-2">🔧</div>
              <div className="font-medium text-gray-900">Настройки</div>
              <div className="text-sm text-gray-500">Настройки системы</div>
            </Link>
            <a href="/" target="_blank" className="bg-teal-50 p-4 rounded-lg hover:bg-teal-100 flex flex-col items-center text-center">
              <div className="text-teal-600 text-2xl mb-2">🏠</div>
              <div className="font-medium text-gray-900">Перейти на сайт</div>
              <div className="text-sm text-gray-500">Открыть в новой вкладке</div>
            </a>
          </div>
        </div>

        {/* Pending moderation */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-8">
          <div className="px-6 py-4 border-b flex justify-between items-center">
            <div>
              <h2 className="text-lg font-medium text-gray-900">Ожидают модерации</h2>
              <p className="text-sm text-gray-500 mt-1">
                Товары: {stats?.pendingModeration?.length || 0}
              </p>
            </div>
            <button
              className="p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100"
              onClick={loadAdminData}
              disabled={refreshing}
            >
              <ArrowPathIcon className={`h-5 w-5 ${refreshing ? 'animate-spin' : ''}`} />
            </button>
          </div>
          <div className="overflow-x-auto">
            {stats?.pendingModeration && stats.pendingModeration.length > 0 ? (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Название
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Продавец
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Цена
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Дата
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Действия
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {stats.pendingModeration.map((product: UserProduct) => (
                    <tr key={product.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {product.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {product.title}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {product.userId}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {product.price} ₽
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(product.created).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          className="text-green-600 hover:text-green-900 mr-3"
                          onClick={() => handleApproveProduct(product.id)}
                        >
                          <CheckIcon className="h-5 w-5 inline mr-1" />
                          Одобрить
                        </button>
                        <button
                          className="text-red-600 hover:text-red-900"
                          onClick={() => handleRejectProduct(product.id)}
                        >
                          <XMarkIcon className="h-5 w-5 inline mr-1" />
                          Отклонить
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="py-12 px-6 text-center">
                <ExclamationTriangleIcon className="mx-auto h-12 w-12 text-gray-300" />
                <h3 className="mt-2 text-lg font-semibold text-gray-900">Нет товаров для модерации</h3>
                <p className="mt-1 text-gray-500">На данный момент нет товаров, ожидающих модерации.</p>
              </div>
            )}
          </div>
        </div>

        {/* Recent transactions */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-8">
          <div className="px-6 py-4 border-b">
            <h2 className="text-lg font-medium text-gray-900">Последние транзакции</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Пользователь
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Сумма
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Статус
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Дата
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {stats?.recentTransactions?.map((transaction: any) => (
                  <tr key={transaction.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {transaction.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {transaction.userId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {transaction.amount} ₽
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          transaction.status === 'completed'
                            ? 'bg-green-100 text-green-800'
                            : transaction.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : transaction.status === 'refunded'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {transaction.status === 'completed'
                          ? 'Завершен'
                          : transaction.status === 'pending'
                          ? 'В ожидании'
                          : transaction.status === 'refunded'
                          ? 'Возврат'
                          : 'Ошибка'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(transaction.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
                {(!stats?.recentTransactions || stats.recentTransactions.length === 0) && (
                  <tr>
                    <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                      Нет данных о транзакциях
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
