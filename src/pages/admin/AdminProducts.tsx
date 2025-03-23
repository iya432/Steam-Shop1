import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getUserProducts, updateUserProduct } from '../../services/userProductsService';
import { MagnifyingGlassIcon, PlusCircleIcon } from '@heroicons/react/24/outline';

interface Product {
  id: string;
  title: string;
  price: number;
  category: string;
  status: 'active' | 'pending' | 'sold' | 'rejected';
  offerType: string;
  userId: string;
  created: string;
  updated: string;
  featuredImage: string;
}

const STATUS_LABELS: Record<string, { text: string, className: string }> = {
  'active': { text: 'Активен', className: 'bg-green-100 text-green-800' },
  'pending': { text: 'На модерации', className: 'bg-yellow-100 text-yellow-800' },
  'sold': { text: 'Продан', className: 'bg-blue-100 text-blue-800' },
  'rejected': { text: 'Отклонен', className: 'bg-red-100 text-red-800' },
};

const AdminProducts = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [adminUser, setAdminUser] = useState<any>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

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

      // Fetch products data
      const allProducts = getUserProducts();
      setProducts(allProducts);
      setLoading(false);
    } catch (error) {
      console.error('Failed to parse admin user data', error);
      navigate('/adminpaneel');
    }
  }, [navigate]);

  // Filter and sort products
  const filteredProducts = products.filter(product => {
    const searchLower = searchQuery.toLowerCase();
    const categoryMatch = selectedCategory === 'all' || product.category === selectedCategory;
    const statusMatch = selectedStatus === 'all' || product.status === selectedStatus;

    return (
      (product.title.toLowerCase().includes(searchLower) ||
       product.id.toLowerCase().includes(searchLower) ||
       product.userId.toLowerCase().includes(searchLower)) &&
      categoryMatch &&
      statusMatch
    );
  });

  const handleApproveProduct = (productId: string) => {
    // Update product status to active
    const updated = updateUserProduct(productId, { status: 'active' });

    if (updated) {
      // Update local state
      setProducts(products.map(p =>
        p.id === productId ? { ...p, status: 'active' } : p
      ));
    }
  };

  const handleRejectProduct = (productId: string) => {
    // Update product status to rejected
    const updated = updateUserProduct(productId, { status: 'rejected' });

    if (updated) {
      // Update local state
      setProducts(products.map(p =>
        p.id === productId ? { ...p, status: 'rejected' } : p
      ));
    }
  };

  const categories = [
    { id: 'all', name: 'Все категории' },
    { id: 'account', name: 'Аккаунты' },
    { id: 'balance', name: 'Пополнение баланса' },
    { id: 'game', name: 'Игры' },
    { id: 'skin', name: 'Скины' },
    { id: 'key', name: 'Ключи' },
    { id: 'service', name: 'Услуги' },
  ];

  const statuses = [
    { id: 'all', name: 'Все статусы' },
    { id: 'active', name: 'Активные' },
    { id: 'pending', name: 'На модерации' },
    { id: 'sold', name: 'Проданные' },
    { id: 'rejected', name: 'Отклоненные' },
  ];

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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Управление товарами</h2>
            <p className="text-sm text-gray-500">Всего товаров: {products.length}</p>
          </div>
          <div className="flex space-x-4">
            <Link
              to="/adminpaneel/dashboard"
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
            >
              Дашборд
            </Link>
            <Link
              to="/adminpaneel/users"
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
            >
              Пользователи
            </Link>
            <Link
              to="/adminpaneel/settings"
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
            >
              Настройки
            </Link>
          </div>
        </div>

        {/* Filters & Search */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <input
                type="text"
                placeholder="Поиск товаров..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            </div>

            {/* Category Filter */}
            <div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {statuses.map(status => (
                  <option key={status.id} value={status.id}>
                    {status.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-4 flex justify-between items-center">
            <div className="text-sm text-gray-500">
              Найдено товаров: {filteredProducts.length}
            </div>
            <Link to="/admin/products/add" className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
              <PlusCircleIcon className="h-5 w-5 mr-2" />
              <span>Добавить товар</span>
            </Link>
          </div>
        </div>

        {/* Products Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Товар
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Категория
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Цена
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Продавец
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Статус
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Дата создания
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Действия
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <img
                            src={product.featuredImage}
                            alt={product.title}
                            className="h-10 w-10 rounded-md object-cover"
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{product.title}</div>
                          <div className="text-sm text-gray-500">ID: {product.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {product.category === 'account' ? 'Аккаунт' :
                         product.category === 'balance' ? 'Пополнение баланса' :
                         product.category === 'game' ? 'Игра' :
                         product.category === 'skin' ? 'Скин' :
                         product.category === 'key' ? 'Ключ' :
                         product.category === 'service' ? 'Услуга' :
                         product.category}
                      </div>
                      <div className="text-xs text-gray-500">
                        {product.offerType === 'sale' ? 'Продажа' :
                         product.offerType === 'rent' ? 'Аренда' :
                         product.offerType === 'exchange' ? 'Обмен' :
                         product.offerType === 'discount' ? 'Скидка' :
                         product.offerType}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{product.price} ₽</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {product.userId}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${STATUS_LABELS[product.status].className}`}>
                        {STATUS_LABELS[product.status].text}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(product.created).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <Link
                          to={`/products/${product.id}`}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          Просмотр
                        </Link>

                        {product.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleApproveProduct(product.id)}
                              className="text-green-600 hover:text-green-900"
                            >
                              Одобрить
                            </button>
                            <button
                              onClick={() => handleRejectProduct(product.id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              Отклонить
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredProducts.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-6 py-4 text-center text-sm text-gray-500">
                      Товары не найдены
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProducts;
