import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { EyeIcon, EyeSlashIcon, PencilIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { getAllUsers, getUserCredentials, updateUserCredentials, AdminUser } from '../../services/adminService';

const AdminUserCredentials = () => {
  const navigate = useNavigate();
  const [adminUser, setAdminUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState({ email: '', password: '' });
  const [showPasswords, setShowPasswords] = useState<Record<string, boolean>>({});

  useEffect(() => {
    // Check if user is logged in as admin
    const storedAdmin = localStorage.getItem('admin_user');

    if (!storedAdmin) {
      navigate('/adminpaneel');
      return;
    }

    try {
      const parsedAdmin = JSON.parse(storedAdmin);
      if (!parsedAdmin || !parsedAdmin.isAuthenticated || parsedAdmin.role !== 'admin') {
        // Only allow admins (not moderators) to access this page
        navigate('/adminpaneel');
        return;
      }

      setAdminUser(parsedAdmin);

      // Load users data
      loadUsersData();
    } catch (error) {
      console.error('Failed to parse admin user data', error);
      navigate('/adminpaneel');
    }
  }, [navigate]);

  const loadUsersData = async () => {
    setLoading(true);
    try {
      // Get all users
      const allUsers = getAllUsers();

      // For each user, get their credentials
      const usersWithCredentials = allUsers.map(user => {
        const credentials = getUserCredentials(user.id);
        return {
          ...user,
          credentials: credentials || { email: 'N/A', password: 'N/A' }
        };
      });

      setUsers(usersWithCredentials as any);
    } catch (error) {
      console.error('Error loading user data:', error);
      setError('Ошибка при загрузке данных пользователей');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_user');
    navigate('/adminpaneel');
  };

  const filteredUsers = users.filter(user => {
    const searchLower = searchQuery.toLowerCase();
    return (
      user.username.toLowerCase().includes(searchLower) ||
      user.email.toLowerCase().includes(searchLower) ||
      user.id.toLowerCase().includes(searchLower)
    );
  });

  const togglePasswordVisibility = (userId: string) => {
    setShowPasswords(prev => ({
      ...prev,
      [userId]: !prev[userId]
    }));
  };

  const startEditing = (user: any) => {
    setEditingUserId(user.id);
    setEditFormData({
      email: user.credentials.email,
      password: user.credentials.password
    });
  };

  const cancelEditing = () => {
    setEditingUserId(null);
    setEditFormData({ email: '', password: '' });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const saveCredentials = (userId: string) => {
    try {
      // Call API to update credentials
      const success = updateUserCredentials(userId, {
        email: editFormData.email,
        password: editFormData.password
      });

      if (success) {
        // Update local state
        setUsers(users.map(user => {
          if (user.id === userId) {
            return {
              ...user,
              credentials: {
                email: editFormData.email,
                password: editFormData.password
              }
            };
          }
          return user;
        }));

        setSuccess(`Учетные данные пользователя ${userId} успешно обновлены`);
        setTimeout(() => setSuccess(null), 3000);
      } else {
        setError('Не удалось обновить учетные данные');
        setTimeout(() => setError(null), 3000);
      }
    } catch (error) {
      console.error('Error updating credentials:', error);
      setError('Ошибка при обновлении учетных данных');
      setTimeout(() => setError(null), 3000);
    }

    // Reset editing state
    setEditingUserId(null);
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Учетные данные пользователей</h2>
            <p className="text-sm text-gray-500">Управление данными авторизации пользователей</p>
          </div>
          <div className="flex space-x-4">
            <Link
              to="/admin"
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
            >
              Дашборд
            </Link>
            <Link
              to="/admin/users"
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
            >
              Пользователи
            </Link>
            <Link
              to="/admin/settings"
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
            >
              Настройки
            </Link>
          </div>
        </div>

        {success && (
          <div className="mb-6 bg-green-50 border-l-4 border-green-500 p-4">
            <div className="flex">
              <CheckIcon className="h-5 w-5 text-green-500 mr-2" />
              <div className="text-green-700">{success}</div>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4">
            <div className="flex">
              <XMarkIcon className="h-5 w-5 text-red-500 mr-2" />
              <div className="text-red-700">{error}</div>
            </div>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="mb-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Поиск пользователей..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                🔍
              </span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Пользователь
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email для входа
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Пароль
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Роль
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Действия
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map((user: any) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <img
                            src={user.avatar || `https://ui-avatars.com/api/?name=${user.username}&background=random`}
                            alt={user.username}
                            className="h-10 w-10 rounded-full"
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{user.username}</div>
                          <div className="text-sm text-gray-500">
                            {user.isActive ? (
                              <span className="text-green-600">Активен</span>
                            ) : (
                              <span className="text-red-600">Неактивен</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {editingUserId === user.id ? (
                        <input
                          type="email"
                          name="email"
                          value={editFormData.email}
                          onChange={handleInputChange}
                          className="w-full px-3 py-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      ) : (
                        <span className="text-gray-900">{user.credentials.email}</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {editingUserId === user.id ? (
                        <div className="relative">
                          <input
                            type={showPasswords[user.id] ? "text" : "password"}
                            name="password"
                            value={editFormData.password}
                            onChange={handleInputChange}
                            className="w-full px-3 py-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                          <button
                            onClick={() => togglePasswordVisibility(user.id)}
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400"
                          >
                            {showPasswords[user.id] ? (
                              <EyeSlashIcon className="h-4 w-4" />
                            ) : (
                              <EyeIcon className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      ) : (
                        <div className="relative">
                          <span className="text-gray-900">
                            {showPasswords[user.id] ? user.credentials.password : '••••••••'}
                          </span>
                          <button
                            onClick={() => togglePasswordVisibility(user.id)}
                            className="ml-2 text-gray-400 hover:text-gray-500 inline-flex items-center"
                          >
                            {showPasswords[user.id] ? (
                              <EyeSlashIcon className="h-4 w-4" />
                            ) : (
                              <EyeIcon className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        user.role === 'admin'
                          ? 'bg-purple-100 text-purple-800'
                          : user.role === 'moderator'
                          ? 'bg-blue-100 text-blue-800'
                          : user.role === 'support'
                          ? 'bg-teal-100 text-teal-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {user.role === 'admin'
                          ? 'Администратор'
                          : user.role === 'moderator'
                          ? 'Модератор'
                          : user.role === 'support'
                          ? 'Поддержка'
                          : 'Пользователь'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {editingUserId === user.id ? (
                        <div className="flex space-x-2">
                          <button
                            onClick={() => saveCredentials(user.id)}
                            className="text-green-600 hover:text-green-900"
                          >
                            <CheckIcon className="h-5 w-5" />
                          </button>
                          <button
                            onClick={cancelEditing}
                            className="text-red-600 hover:text-red-900"
                          >
                            <XMarkIcon className="h-5 w-5" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => startEditing(user)}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          <PencilIcon className="h-5 w-5" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
                {filteredUsers.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                      Пользователи не найдены
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Безопасность учетных данных</h3>
          <div className="prose text-gray-500">
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-yellow-700">
                    Внимание! Учетные данные пользователей должны быть строго конфиденциальными. Используйте эту страницу только для решения проблем с доступом.
                  </p>
                </div>
              </div>
            </div>

            <p>
              На этой странице вы можете просматривать и редактировать учетные данные пользователей.
              Все действия с учетными данными записываются в журнал безопасности.
            </p>

            <h4 className="text-md font-medium text-gray-700 mt-4">Рекомендации по безопасности:</h4>
            <ul className="list-disc pl-5 mt-2">
              <li>Используйте надежные пароли из не менее 8 символов</li>
              <li>Включайте буквы, цифры и специальные символы</li>
              <li>Регулярно меняйте пароли админ-аккаунтов</li>
              <li>Не используйте одинаковые пароли для разных пользователей</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminUserCredentials;
