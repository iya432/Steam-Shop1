import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  XCircleIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../../context/AuthContext';
import {
  getUserProducts,
  getUserProductsStats,
  deleteUserProduct,
  UserProduct,
  ProductStatus,
  PRODUCT_CATEGORIES
} from '../../services/userProductsService';

// Status badge component to show product status with appropriate colors
const StatusBadge = ({ status }: { status: ProductStatus }) => {
  let className = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium';
  let label = '';

  switch (status) {
    case 'active':
      className += ' bg-green-100 text-green-800';
      label = 'Активен';
      break;
    case 'pending':
      className += ' bg-yellow-100 text-yellow-800';
      label = 'На модерации';
      break;
    case 'sold':
      className += ' bg-blue-100 text-blue-800';
      label = 'Продан';
      break;
    case 'rejected':
      className += ' bg-red-100 text-red-800';
      label = 'Отклонен';
      break;
    default:
      className += ' bg-gray-100 text-gray-800';
      label = status;
  }

  return <span className={className}>{label}</span>;
};

const MyProducts = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState<UserProduct[]>([]);
  const [stats, setStats] = useState({ total: 0, active: 0, pending: 0, sold: 0, rejected: 0 });
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<ProductStatus | 'all'>('all');
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      // Загружаем товары пользователя
      const userProducts = getUserProducts(user.id);
      setProducts(userProducts);
      setStats(getUserProductsStats(user.id));
      setLoading(false);
    } else {
      navigate('/login', { state: { from: '/profile/products' } });
    }
  }, [user, navigate]);

  // Фильтрация товаров по статусу
  const filteredProducts = filter === 'all'
    ? products
    : products.filter(product => product.status === filter);

  // Обработчик удаления товара
  const handleDeleteProduct = (productId: string) => {
    if (deleteConfirm === productId) {
      // Подтверждение удаления - выполняем операцию
      const success = deleteUserProduct(productId);
      if (success && user) {
        // Обновляем список товаров и статистику
        setProducts(getUserProducts(user.id));
        setStats(getUserProductsStats(user.id));
      }
      setDeleteConfirm(null);
    } else {
      // Запрос на подтверждение удаления
      setDeleteConfirm(productId);
    }
  };

  return (
    <div className="bg-gray-100 py-8 min-h-screen">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Мои товары</h1>
          <Link
            to="/profile/products/new"
            className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
          >
            <PlusIcon className="w-5 h-5" />
            <span>Добавить товар</span>
          </Link>
        </div>

        {/* Статистика */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-lg font-bold mb-4">Статистика товаров</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div
              className={`rounded-md p-4 text-center cursor-pointer transition-colors ${filter === 'all' ? 'bg-gray-200' : 'bg-gray-100 hover:bg-gray-200'}`}
              onClick={() => setFilter('all')}
            >
              <div className="text-xl font-bold">{stats.total}</div>
              <div className="text-gray-600">Всего</div>
            </div>
            <div
              className={`rounded-md p-4 text-center cursor-pointer transition-colors ${filter === 'active' ? 'bg-green-100' : 'bg-green-50 hover:bg-green-100'}`}
              onClick={() => setFilter('active')}
            >
              <div className="text-xl font-bold text-green-700">{stats.active}</div>
              <div className="text-green-600">Активных</div>
            </div>
            <div
              className={`rounded-md p-4 text-center cursor-pointer transition-colors ${filter === 'pending' ? 'bg-yellow-100' : 'bg-yellow-50 hover:bg-yellow-100'}`}
              onClick={() => setFilter('pending')}
            >
              <div className="text-xl font-bold text-yellow-700">{stats.pending}</div>
              <div className="text-yellow-600">На модерации</div>
            </div>
            <div
              className={`rounded-md p-4 text-center cursor-pointer transition-colors ${filter === 'sold' ? 'bg-blue-100' : 'bg-blue-50 hover:bg-blue-100'}`}
              onClick={() => setFilter('sold')}
            >
              <div className="text-xl font-bold text-blue-700">{stats.sold}</div>
              <div className="text-blue-600">Проданных</div>
            </div>
            <div
              className={`rounded-md p-4 text-center cursor-pointer transition-colors ${filter === 'rejected' ? 'bg-red-100' : 'bg-red-50 hover:bg-red-100'}`}
              onClick={() => setFilter('rejected')}
            >
              <div className="text-xl font-bold text-red-700">{stats.rejected}</div>
              <div className="text-red-600">Отклоненных</div>
            </div>
          </div>
        </div>

        {/* Активный фильтр */}
        {filter !== 'all' && (
          <div className="mb-4 flex items-center">
            <span className="mr-2">Фильтр:</span>
            <StatusBadge status={filter} />
            <button
              onClick={() => setFilter('all')}
              className="ml-2 text-gray-500 hover:text-gray-700"
            >
              <XCircleIcon className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Список товаров */}
        {loading ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <ArrowPathIcon className="w-8 h-8 mx-auto mb-4 animate-spin text-blue-500" />
            <p>Загрузка товаров...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShoppingBagIcon className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold mb-2">У вас пока нет товаров{filter !== 'all' ? ` со статусом "${filter}"` : ''}</h3>
            <p className="text-gray-600 mb-6">
              Создайте свой первый товар для продажи прямо сейчас!
            </p>
            <Link
              to="/profile/products/new"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md transition-colors"
            >
              Добавить товар
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <div key={product.id} className="bg-white rounded-lg shadow overflow-hidden">
                <div className="relative h-40">
                  <img
                    src={product.featuredImage}
                    alt={product.title}
                    className="w-full h-full object-cover"
                  />

                  {/* Status Badge - Top Right */}
                  <div className="absolute top-2 right-2">
                    <StatusBadge status={product.status} />
                  </div>

                  {/* Category Badge - Top Left */}
                  <div className="absolute top-2 left-2 bg-gray-800 bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                    {PRODUCT_CATEGORIES.find(cat => cat.id === product.category)?.name || product.category}
                  </div>
                </div>

                <div className="p-4">
                  <h3 className="font-bold text-lg mb-1 truncate">{product.title}</h3>
                  <div className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</div>

                  {/* Moderation Information */}
                  {product.status === 'rejected' && product.moderationComment && (
                    <div className="mb-3 p-2 bg-red-50 border border-red-200 rounded-md">
                      <p className="text-sm text-red-700">
                        <span className="font-medium">Причина отклонения:</span> {product.moderationComment}
                      </p>
                      {product.moderatedAt && (
                        <p className="text-xs text-red-500 mt-1">
                          {new Date(product.moderatedAt).toLocaleString()}
                        </p>
                      )}
                    </div>
                  )}

                  {product.status === 'active' && product.moderatedAt && (
                    <div className="mb-3 text-xs text-gray-500">
                      Одобрен: {new Date(product.moderatedAt).toLocaleString()}
                    </div>
                  )}

                  <div className="flex justify-between items-center">
                    <div>
                      <span className="font-bold text-lg">{product.price} ₽</span>
                      {product.discountPrice && (
                        <span className="text-sm text-gray-500 line-through ml-2">
                          {product.discountPrice} ₽
                        </span>
                      )}
                    </div>
                    <div className="flex space-x-2">
                      <Link
                        to={`/profile/products/edit/${product.id}`}
                        className="p-1 bg-blue-100 text-blue-600 rounded hover:bg-blue-200 transition-colors"
                        title="Редактировать"
                      >
                        <PencilIcon className="w-5 h-5" />
                      </Link>
                      <button
                        onClick={() => handleDeleteProduct(product.id)}
                        className={`p-1 rounded transition-colors ${
                          deleteConfirm === product.id
                            ? 'bg-red-100 text-red-600 hover:bg-red-200'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                        title={deleteConfirm === product.id ? "Подтвердить удаление" : "Удалить"}
                      >
                        <TrashIcon className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Иконка для пустого состояния
const ShoppingBagIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    className={className}
  >
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
  </svg>
);

export default MyProducts;
