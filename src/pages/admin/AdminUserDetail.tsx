import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { getUserById, getUserProductsById , UserRole } from '../../services/adminService';
import { ArrowLeftIcon, PencilSquareIcon, CheckIcon } from '@heroicons/react/24/outline';

interface AdminUser {
  id: string;
  email: string;
  username: string;
  role: UserRole;
  registrationDate: string;
  lastLogin: string;
  isActive: boolean;
  avatar?: string;
}

interface UserProduct {
  id: string;
  title: string;
  price: number;
  status: string;
  category: string;
  created: string;
  featuredImage: string;
}

const AdminUserDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [user, setUser] = useState<AdminUser | null>(null);
  const [products, setProducts] = useState<UserProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [adminUser, setAdminUser] = useState<any>(null);
  const [editMode, setEditMode] = useState(false);

  // Editable fields
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<UserRole>('user');
  const [isActive, setIsActive] = useState(false);

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

      // Fetch user data
      if (id) {
        const userData = getUserById(id);

        if (userData) {
          setUser(userData);
          setUsername(userData.username);
          setEmail(userData.email);
          setRole(userData.role);
          setIsActive(userData.isActive);

          // Fetch user products
          const userProducts = getUserProductsById(id);
          setProducts(userProducts || []);
        }
      }

      setLoading(false);
    } catch (error) {
      console.error('Failed to parse admin user data', error);
      navigate('/adminpaneel');
    }
  }, [navigate, id]);

  const handleSave = () => {
    // In a real app, this would update the user in the database
    if (user) {
      const updatedUser = {
        ...user,
        username,
        email,
        role,
        isActive
      };

      setUser(updatedUser);
      setEditMode(false);

      // Show success message or handle errors
      alert('Пользователь успешно обновлен!');
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

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-xl text-gray-600">Пользователь не найден</div>
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
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center">
            <button
              onClick={() => navigate('/adminpaneel/users')}
              className="flex items-center text-gray-600 hover:text-gray-900"
            >
              <ArrowLeftIcon className="h-5 w-5 mr-2" />
              <span>Назад к пользователям</span>
            </button>
          </div>
          <div className="flex space-x-4">
            <Link
              to="/adminpaneel/dashboard"
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
            >
              Дашборд
            </Link>
            <Link
              to="/adminpaneel/products"
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
            >
              Товары
            </Link>
            <Link
              to="/adminpaneel/settings"
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
            >
              Настройки
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6 border-b">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">Информация о пользователе</h2>
              {!editMode ? (
                <button
                  onClick={() => setEditMode(true)}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  <PencilSquareIcon className="h-5 w-5 mr-2" />
                  <span>Редактировать</span>
                </button>
              ) : (
                <button
                  onClick={handleSave}
                  className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                  <CheckIcon className="h-5 w-5 mr-2" />
                  <span>Сохранить</span>
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center">
                  <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200 mb-4 md:mb-0 md:mr-6">
                    {user.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.username}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-300 text-gray-600 text-2xl font-bold">
                        {user.username.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div>
                    {editMode ? (
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Имя пользователя
                        </label>
                        <input
                          type="text"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    ) : (
                      <div className="text-2xl font-bold text-gray-900 mb-1">{user.username}</div>
                    )}

                    <div className="text-sm text-gray-500">ID: {user.id}</div>
                  </div>
                </div>

                {/* User Details */}
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Контактная информация</h3>
                    {editMode ? (
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Email
                        </label>
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    ) : (
                      <div className="text-gray-700">{user.email}</div>
                    )}
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Роль</h3>
                    {editMode ? (
                      <div className="mb-4">
                        <select
                          value={role}
                          onChange={(e) => setRole(e.target.value as UserRole)}
                          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="user">Пользователь</option>
                          <option value="moderator">Модератор</option>
                          <option value="support">Поддержка</option>
                          <option value="admin">Администратор</option>
                        </select>
                      </div>
                    ) : (
                      <div>
                        <span
                          className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full
                            ${user.role === 'admin'
                              ? 'bg-purple-100 text-purple-800'
                              : user.role === 'moderator'
                              ? 'bg-blue-100 text-blue-800'
                              : user.role === 'support'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                            }`}
                        >
                          {user.role === 'admin'
                            ? 'Администратор'
                            : user.role === 'moderator'
                            ? 'Модератор'
                            : user.role === 'support'
                            ? 'Поддержка'
                            : 'Пользователь'
                          }
                        </span>
                      </div>
                    )}
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Статус</h3>
                    {editMode ? (
                      <div className="mb-4">
                        <label className="inline-flex items-center">
                          <input
                            type="checkbox"
                            checked={isActive}
                            onChange={(e) => setIsActive(e.target.checked)}
                            className="rounded text-blue-600 focus:ring-blue-500 h-4 w-4"
                          />
                          <span className="ml-2 text-gray-700">Активен</span>
                        </label>
                      </div>
                    ) : (
                      <div>
                        <span
                          className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {user.isActive ? 'Активен' : 'Неактивен'}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Даты</h3>
                  <div className="space-y-2">
                    <div className="flex items-start">
                      <div className="text-sm font-medium text-gray-500 w-48">Дата регистрации:</div>
                      <div className="text-sm text-gray-900">
                        {new Date(user.registrationDate).toLocaleString()}
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="text-sm font-medium text-gray-500 w-48">Последний вход:</div>
                      <div className="text-sm text-gray-900">
                        {new Date(user.lastLogin).toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Security Info (placeholder) */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Безопасность</h3>
                  <div className="space-y-2">
                    <div className="flex items-start">
                      <div className="text-sm font-medium text-gray-500 w-48">Пароль:</div>
                      <div className="text-sm text-gray-900">********</div>
                    </div>
                    <div>
                      <button className="text-sm text-blue-600 hover:text-blue-800">
                        Сбросить пароль
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* User Products */}
          <div className="p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Товары пользователя</h3>

            {products.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Изображение
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Название
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Категория
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Цена
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Статус
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Дата создания
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {products.map((product) => (
                      <tr key={product.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex-shrink-0 h-10 w-10">
                            <img
                              src={product.featuredImage}
                              alt={product.title}
                              className="h-10 w-10 rounded-md object-cover"
                            />
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{product.title}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{product.category}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{product.price} ₽</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              product.status === 'active'
                                ? 'bg-green-100 text-green-800'
                                : product.status === 'pending'
                                ? 'bg-yellow-100 text-yellow-800'
                                : product.status === 'sold'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {product.status === 'active'
                              ? 'Активен'
                              : product.status === 'pending'
                              ? 'На модерации'
                              : product.status === 'sold'
                              ? 'Продан'
                              : 'Отклонен'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">
                            {new Date(product.created).toLocaleDateString()}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="bg-gray-50 p-4 rounded-md text-center text-gray-500">
                У пользователя нет товаров
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminUserDetail;
