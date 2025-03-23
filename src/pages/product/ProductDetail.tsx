import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeftIcon,
  ShoppingCartIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  UserCircleIcon,
  ClockIcon,
  ShieldCheckIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/outline';
import { useCart } from '../../context/CartContext';
import { getUserProductById } from '../../services/userProductsService';

const ProductDetail = () => {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeImage, setActiveImage] = useState<string | null>(null);
  const [addedToCart, setAddedToCart] = useState(false);

  // Fetch product data
  useEffect(() => {
    if (!productId) {
      setError('ID товара не указан');
      setLoading(false);
      return;
    }

    try {
      const productData = getUserProductById(productId);

      if (!productData) {
        setError('Товар не найден');
        setLoading(false);
        return;
      }

      // Only active products can be viewed
      if (productData.status !== 'active') {
        setError('Товар недоступен');
        setLoading(false);
        return;
      }

      setProduct(productData);
      setActiveImage(productData.featuredImage);
      setLoading(false);
    } catch (err) {
      setError('Ошибка при загрузке данных товара');
      setLoading(false);
    }
  }, [productId]);

  // Calculate price based on discount or offer type
  const getDisplayPrice = () => {
    if (!product) return { original: 0, final: 0, discount: false };

    const original = product.price;
    let final = original;
    let discount = false;

    if (product.discountPrice) {
      final = product.discountPrice;
      discount = true;
    }

    return { original, final, discount };
  };

  // Handle add to cart
  const handleAddToCart = () => {
    if (!product) return;

    addToCart({
      id: Number(product.id),
      title: product.title,
      price: product.price,
      image: product.featuredImage,
      type: product.category,
      discount: product.discountPrice ? Math.round((1 - product.discountPrice / product.price) * 100) : undefined,
    });

    setAddedToCart(true);

    // Reset the "Added to cart" status after 3 seconds
    setTimeout(() => {
      setAddedToCart(false);
    }, 3000);
  };

  // Handle buy now
  const handleBuyNow = () => {
    if (!product) return;

    addToCart({
      id: Number(product.id),
      title: product.title,
      price: product.price,
      image: product.featuredImage,
      type: product.category,
      discount: product.discountPrice ? Math.round((1 - product.discountPrice / product.price) * 100) : undefined,
    });

    navigate('/cart');
  };

  if (loading) {
    return (
      <div className="bg-gray-100 py-8 min-h-screen">
        <div className="container mx-auto px-4">
          <div className="bg-white p-8 rounded-lg shadow-md text-center">
            <div className="animate-pulse flex flex-col items-center">
              <div className="rounded-lg bg-gray-300 h-64 w-full mb-4"></div>
              <div className="h-6 bg-gray-300 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-gray-300 rounded w-1/2 mb-2"></div>
              <div className="h-4 bg-gray-300 rounded w-1/4 mb-2"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="bg-gray-100 py-8 min-h-screen">
        <div className="container mx-auto px-4">
          <div className="bg-white p-8 rounded-lg shadow-md text-center">
            <ExclamationCircleIcon className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Ошибка</h2>
            <p className="text-gray-600 mb-4">{error || 'Товар не найден'}</p>
            <button
              onClick={() => navigate(-1)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md transition-colors"
            >
              Вернуться назад
            </button>
          </div>
        </div>
      </div>
    );
  }

  const { original, final, discount } = getDisplayPrice();

  return (
    <div className="bg-gray-100 py-8 min-h-screen">
      <div className="container mx-auto px-4">
        {/* Breadcrumbs */}
        <div className="mb-6">
          <div className="flex items-center space-x-2 text-sm">
            <Link to="/" className="text-gray-600 hover:text-blue-600">Главная</Link>
            <ChevronRightIcon className="w-4 h-4 text-gray-500" />
            <Link to={`/${product.category === 'account' ? 'accounts' : product.category === 'balance' ? 'balance' : 'games'}`} className="text-gray-600 hover:text-blue-600">
              {product.category === 'account'
                ? 'Аккаунты'
                : product.category === 'balance'
                ? 'Пополнение баланса'
                : product.category === 'game'
                ? 'Игры'
                : product.category === 'skin'
                ? 'Скины'
                : product.category === 'key'
                ? 'Ключи'
                : 'Услуги'}
            </Link>
            <ChevronRightIcon className="w-4 h-4 text-gray-500" />
            <span className="text-gray-800 font-medium truncate">{product.title}</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="md:flex">
            {/* Gallery Section */}
            <div className="md:w-1/2 p-6">
              {/* Main Image */}
              <div className="bg-gray-100 rounded-lg overflow-hidden mb-4 h-80">
                <img
                  src={activeImage || product.featuredImage}
                  alt={product.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Thumbnails */}
              {product.images.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {product.images.map((image: string, index: number) => (
                    <div
                      key={index}
                      className={`rounded-lg overflow-hidden cursor-pointer border-2 ${
                        activeImage === image ? 'border-blue-500' : 'border-transparent'
                      }`}
                      onClick={() => setActiveImage(image)}
                    >
                      <img
                        src={image}
                        alt={`Изображение ${index + 1}`}
                        className="w-full h-20 object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* Seller info */}
              <div className="mt-6 p-4 bg-gray-50 rounded-md">
                <h3 className="font-medium text-gray-900 mb-2">Продавец</h3>
                <div className="flex items-center">
                  <UserCircleIcon className="w-10 h-10 text-gray-400 mr-3" />
                  <div>
                    <div className="font-medium">Пользователь</div>
                    <div className="text-sm text-gray-500">На сайте с {new Date(product.created).toLocaleDateString()}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Details Section */}
            <div className="md:w-1/2 p-6 bg-gray-50">
              {/* Type badge */}
              <div className="mb-2">
                <span className={`inline-block px-3 py-1 text-xs rounded-full font-medium ${
                  product.offerType === 'sale'
                    ? 'bg-blue-100 text-blue-800'
                    : product.offerType === 'rent'
                    ? 'bg-purple-100 text-purple-800'
                    : product.offerType === 'exchange'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {product.offerType === 'sale'
                    ? 'Продажа'
                    : product.offerType === 'rent'
                    ? 'Аренда'
                    : product.offerType === 'exchange'
                    ? 'Обмен'
                    : 'Со скидкой'}
                </span>
                <span className="ml-2 inline-block px-3 py-1 text-xs rounded-full font-medium bg-gray-200 text-gray-800">
                  {product.category === 'account'
                    ? 'Аккаунт'
                    : product.category === 'balance'
                    ? 'Пополнение'
                    : product.category === 'game'
                    ? 'Игра'
                    : product.category === 'skin'
                    ? 'Скин'
                    : product.category === 'key'
                    ? 'Ключ'
                    : 'Услуга'}
                </span>
              </div>

              <h1 className="text-2xl font-bold mb-2">{product.title}</h1>

              {/* Date */}
              <div className="flex items-center mb-4 text-sm text-gray-500">
                <ClockIcon className="w-4 h-4 mr-1" />
                <span>Добавлено {new Date(product.created).toLocaleDateString()}</span>
              </div>

              {/* Pricing */}
              <div className="flex items-end mb-6">
                <span className="text-3xl font-bold text-gray-900 mr-3">
                  {final} ₽
                </span>
                {discount && (
                  <span className="text-xl text-gray-500 line-through mr-2">
                    {original} ₽
                  </span>
                )}
                {discount && (
                  <span className="ml-2 bg-red-500 text-white text-sm font-bold px-2 py-1 rounded">
                    -{Math.round((1 - product.discountPrice / product.price) * 100)}%
                  </span>
                )}
              </div>

              {/* Rent pricing if applicable */}
              {product.offerType === 'rent' && product.rentPrice && (
                <div className="bg-purple-50 p-3 rounded-md mb-6">
                  <div className="font-medium text-purple-800 mb-1">Условия аренды:</div>
                  <div className="text-sm text-purple-700">
                    <div>Стоимость в день: {product.rentPrice} ₽</div>
                    <div>Максимальный срок: {product.rentDuration} дней</div>
                    <div className="mt-1 text-xs text-purple-600">
                      Полная стоимость аренды на весь срок: {product.rentPrice * product.rentDuration} ₽
                    </div>
                  </div>
                </div>
              )}

              {/* Description */}
              <div className="mb-6">
                <h2 className="text-lg font-bold mb-2">Описание</h2>
                <p className="text-gray-700 whitespace-pre-line">{product.description}</p>
              </div>

              {/* Category-specific features */}
              {product.category === 'account' && (
                <div className="mb-6">
                  <h2 className="text-lg font-bold mb-2">Особенности аккаунта</h2>
                  <div className="grid grid-cols-2 gap-2">
                    {product.level && (
                      <div className="flex items-center">
                        <CheckCircleIcon className="w-5 h-5 text-green-500 mr-2" />
                        <span>Уровень профиля: {product.level}</span>
                      </div>
                    )}
                    {product.games && (
                      <div className="flex items-center">
                        <CheckCircleIcon className="w-5 h-5 text-green-500 mr-2" />
                        <span>Количество игр: {product.games}</span>
                      </div>
                    )}
                    {product.hours && (
                      <div className="flex items-center">
                        <CheckCircleIcon className="w-5 h-5 text-green-500 mr-2" />
                        <span>Часов в играх: {product.hours}</span>
                      </div>
                    )}
                    {product.prime && (
                      <div className="flex items-center">
                        <CheckCircleIcon className="w-5 h-5 text-green-500 mr-2" />
                        <span>Prime Status</span>
                      </div>
                    )}
                    {product.csgo && (
                      <div className="flex items-center">
                        <CheckCircleIcon className="w-5 h-5 text-green-500 mr-2" />
                        <span>CS2 / CS:GO</span>
                      </div>
                    )}
                    {product.dota2 && (
                      <div className="flex items-center">
                        <CheckCircleIcon className="w-5 h-5 text-green-500 mr-2" />
                        <span>Dota 2</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Skin details */}
              {product.category === 'skin' && (
                <div className="mb-6">
                  <h2 className="text-lg font-bold mb-2">Детали скина</h2>
                  <div className="grid grid-cols-2 gap-2">
                    {product.game && (
                      <div className="flex items-center">
                        <CheckCircleIcon className="w-5 h-5 text-green-500 mr-2" />
                        <span>Игра: {product.game}</span>
                      </div>
                    )}
                    {product.rarity && (
                      <div className="flex items-center">
                        <CheckCircleIcon className="w-5 h-5 text-green-500 mr-2" />
                        <span>Редкость: {product.rarity}</span>
                      </div>
                    )}
                    {product.wear && (
                      <div className="flex items-center">
                        <CheckCircleIcon className="w-5 h-5 text-green-500 mr-2" />
                        <span>Износ: {product.wear}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Key details */}
              {product.category === 'key' && (
                <div className="mb-6">
                  <h2 className="text-lg font-bold mb-2">Информация о ключе</h2>
                  <div className="grid grid-cols-2 gap-2">
                    {product.platform && (
                      <div className="flex items-center">
                        <CheckCircleIcon className="w-5 h-5 text-green-500 mr-2" />
                        <span>Платформа: {product.platform}</span>
                      </div>
                    )}
                    {product.region && (
                      <div className="flex items-center">
                        <CheckCircleIcon className="w-5 h-5 text-green-500 mr-2" />
                        <span>Регион: {product.region}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={handleAddToCart}
                  className={`flex items-center justify-center space-x-2 p-3 rounded-md transition-colors ${
                    addedToCart
                      ? 'bg-green-600 hover:bg-green-700 text-white'
                      : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                  }`}
                >
                  {addedToCart ? (
                    <>
                      <CheckCircleIcon className="w-5 h-5" />
                      <span>Добавлено</span>
                    </>
                  ) : (
                    <>
                      <ShoppingCartIcon className="w-5 h-5" />
                      <span>В корзину</span>
                    </>
                  )}
                </button>
                <button
                  onClick={handleBuyNow}
                  className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-md transition-colors"
                >
                  Купить сейчас
                </button>
              </div>

              {/* Guarantee Info */}
              <div className="mt-6 bg-blue-50 p-4 rounded-md">
                <div className="flex items-start">
                  <ShieldCheckIcon className="w-5 h-5 text-blue-600 mt-0.5 mr-2 flex-shrink-0" />
                  <div>
                    <h3 className="font-bold text-blue-900 mb-1">Гарантия безопасности</h3>
                    <p className="text-blue-800 text-sm">
                      Все товары проходят проверку перед размещением на сайте.
                      Гарантия возврата средств в течение 24 часов в случае проблем с товаром.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
